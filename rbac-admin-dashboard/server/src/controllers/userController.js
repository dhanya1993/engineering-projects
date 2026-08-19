import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { canManageRole } from "../utils/permissions.js";

// GET /api/users
// Scoped: SUPER_ADMIN/NATIONAL_MANAGER see everyone; anyone else sees
// only users in their own reporting line, keeping the list itself
// permission-aware rather than just gating the button that opens it.
export const listUsers = asyncHandler(async (req, res) => {
  const { role } = req.user;
  const query = ["SUPER_ADMIN", "NATIONAL_MANAGER"].includes(role)
    ? {}
    : { managerId: req.user._id };

  const users = await User.find(query).sort({ createdAt: -1 });
  res.json(users.map((u) => u.toSafeJSON()));
});

// POST /api/users
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, managerId, region } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error("name, email, password, and role are required.");
  }

  if (!canManageRole(req.user.role, role)) {
    res.status(403);
    throw new Error(`Your role cannot create a user at the "${role}" level.`);
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    res.status(409);
    throw new Error("A user with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
    managerId: managerId || req.user._id,
    region: region || req.user.region
  });

  res.status(201).json(user.toSafeJSON());
});

// PATCH /api/users/:id
export const updateUser = asyncHandler(async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) {
    res.status(404);
    throw new Error("User not found.");
  }

  if (!canManageRole(req.user.role, target.role)) {
    res.status(403);
    throw new Error("Your role cannot modify a user at this level.");
  }

  const { name, region, isActive, role: nextRole } = req.body;

  if (nextRole && nextRole !== target.role && !canManageRole(req.user.role, nextRole)) {
    res.status(403);
    throw new Error(`Your role cannot promote a user to the "${nextRole}" level.`);
  }

  if (name !== undefined) target.name = name;
  if (region !== undefined) target.region = region;
  if (isActive !== undefined) target.isActive = isActive;
  if (nextRole !== undefined) target.role = nextRole;

  await target.save();
  res.json(target.toSafeJSON());
});

// DELETE /api/users/:id  (soft delete — deactivate, never hard-delete an org record)
export const deactivateUser = asyncHandler(async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) {
    res.status(404);
    throw new Error("User not found.");
  }

  if (!canManageRole(req.user.role, target.role)) {
    res.status(403);
    throw new Error("Your role cannot deactivate a user at this level.");
  }

  target.isActive = false;
  await target.save();
  res.json(target.toSafeJSON());
});
