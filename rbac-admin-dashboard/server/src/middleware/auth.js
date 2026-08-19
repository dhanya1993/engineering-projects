import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";

/**
 * Verifies the Bearer token, loads the user, and attaches it to
 * req.user. Downstream RBAC middleware relies on req.user.role being
 * present, so this must always run first on protected routes.
 */
export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    res.status(401);
    throw new Error("Not authenticated. Provide a Bearer token.");
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.status(401);
    throw new Error("Invalid or expired token.");
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) {
    res.status(401);
    throw new Error("Account not found or deactivated.");
  }

  req.user = user;
  next();
});
