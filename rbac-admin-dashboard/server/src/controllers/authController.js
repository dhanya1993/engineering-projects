import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import { ROLE_PERMISSIONS } from "../utils/permissions.js";

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h"
  });
}

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required.");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || !user.isActive) {
    res.status(401);
    throw new Error("Invalid credentials.");
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    res.status(401);
    throw new Error("Invalid credentials.");
  }

  const token = signToken(user);
  res.json({
    token,
    user: user.toSafeJSON(),
    permissions: ROLE_PERMISSIONS[user.role]
  });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    user: req.user.toSafeJSON(),
    permissions: ROLE_PERMISSIONS[req.user.role]
  });
});
