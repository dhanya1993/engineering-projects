import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import { Ticket } from "../models/Ticket.js";

// GET /api/dashboard/summary
export const getSummary = asyncHandler(async (req, res) => {
  const [userCount, activeUserCount, openTickets, resolvedTickets] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ isActive: true }),
    Ticket.countDocuments({ status: { $in: ["open", "in_progress"] } }),
    Ticket.countDocuments({ status: "resolved" })
  ]);

  res.json({
    userCount,
    activeUserCount,
    openTickets,
    resolvedTickets,
    viewerRole: req.user.role
  });
});
