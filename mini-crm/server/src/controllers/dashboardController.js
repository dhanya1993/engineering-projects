import asyncHandler from "express-async-handler";
import { Contact } from "../models/Contact.js";
import { Deal } from "../models/Deal.js";
import { Task } from "../models/Task.js";

// GET /api/dashboard/summary
export const getSummary = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const [contactCount, openDeals, wonDeals, tasksDueToday, overdueTasks] = await Promise.all([
    Contact.countDocuments({ ownerId }),
    Deal.find({ ownerId, stage: { $nin: ["won", "lost"] } }),
    Deal.find({ ownerId, stage: "won" }),
    Task.countDocuments({
      ownerId,
      completed: false,
      dueDate: { $gte: startOfToday, $lte: endOfToday }
    }),
    Task.countDocuments({ ownerId, completed: false, dueDate: { $lt: startOfToday } })
  ]);

  const openPipelineValue = openDeals.reduce((sum, d) => sum + d.value, 0);
  const wonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);

  res.json({
    contactCount,
    openDealCount: openDeals.length,
    openPipelineValue,
    wonDealCount: wonDeals.length,
    wonValue,
    tasksDueToday,
    overdueTasks
  });
});
