import asyncHandler from "express-async-handler";
import { Deal, DEAL_STAGES } from "../models/Deal.js";
import { Activity } from "../models/Activity.js";

// GET /api/deals — returns all deals for the board, grouped client-side by stage
export const listDeals = asyncHandler(async (req, res) => {
  const deals = await Deal.find({ ownerId: req.user._id })
    .populate("contactId", "name company")
    .sort({ stage: 1, position: 1 });
  res.json(deals);
});

// POST /api/deals
export const createDeal = asyncHandler(async (req, res) => {
  const { title, value, currency, contactId, expectedCloseDate } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("A deal title is required.");
  }

  // New deals go to the bottom of the "lead" column.
  const lastInStage = await Deal.findOne({ ownerId: req.user._id, stage: "lead" }).sort({
    position: -1
  });

  const deal = await Deal.create({
    ownerId: req.user._id,
    title,
    value: value || 0,
    currency: currency || "USD",
    contactId: contactId || null,
    expectedCloseDate: expectedCloseDate || null,
    stage: "lead",
    position: lastInStage ? lastInStage.position + 1 : 0
  });

  res.status(201).json(deal);
});

// PATCH /api/deals/:id
// Handles both field edits and kanban drag-and-drop (stage + position changes).
export const updateDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findOne({ _id: req.params.id, ownerId: req.user._id });
  if (!deal) {
    res.status(404);
    throw new Error("Deal not found.");
  }

  const { title, value, currency, contactId, expectedCloseDate, stage, position } = req.body;

  const previousStage = deal.stage;

  if (title !== undefined) deal.title = title;
  if (value !== undefined) deal.value = value;
  if (currency !== undefined) deal.currency = currency;
  if (contactId !== undefined) deal.contactId = contactId;
  if (expectedCloseDate !== undefined) deal.expectedCloseDate = expectedCloseDate;
  if (position !== undefined) deal.position = position;

  if (stage !== undefined) {
    if (!DEAL_STAGES.includes(stage)) {
      res.status(400);
      throw new Error(`Invalid stage "${stage}".`);
    }
    deal.stage = stage;
  }

  await deal.save();

  // Log a timeline entry whenever a card actually moves columns — this
  // is what makes the activity timeline useful later ("this deal sat in
  // Proposal for 12 days before moving to Negotiation").
  if (stage !== undefined && stage !== previousStage) {
    await Activity.create({
      ownerId: req.user._id,
      dealId: deal._id,
      contactId: deal.contactId,
      type: "stage_change",
      content: `Moved from "${previousStage}" to "${stage}".`
    });
  }

  res.json(deal);
});

// DELETE /api/deals/:id
export const deleteDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id });
  if (!deal) {
    res.status(404);
    throw new Error("Deal not found.");
  }
  res.json({ deleted: true });
});
