import asyncHandler from "express-async-handler";
import { Activity, ACTIVITY_TYPES } from "../models/Activity.js";

// GET /api/activities?contactId=&dealId=
export const listActivities = asyncHandler(async (req, res) => {
  const { contactId, dealId } = req.query;
  const query = { ownerId: req.user._id };
  if (contactId) query.contactId = contactId;
  if (dealId) query.dealId = dealId;

  const activities = await Activity.find(query).sort({ createdAt: -1 });
  res.json(activities);
});

// POST /api/activities
export const createActivity = asyncHandler(async (req, res) => {
  const { contactId, dealId, type, content } = req.body;

  if (!type || !ACTIVITY_TYPES.includes(type)) {
    res.status(400);
    throw new Error(`type must be one of: ${ACTIVITY_TYPES.join(", ")}`);
  }
  if (!content) {
    res.status(400);
    throw new Error("Activity content is required.");
  }

  const activity = await Activity.create({
    ownerId: req.user._id,
    contactId: contactId || null,
    dealId: dealId || null,
    type,
    content
  });

  res.status(201).json(activity);
});
