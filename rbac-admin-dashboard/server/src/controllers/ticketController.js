import asyncHandler from "express-async-handler";
import { Ticket } from "../models/Ticket.js";
import { ROLES } from "../utils/permissions.js";

// GET /api/tickets
// Field agents see only tickets assigned to them; managers see their region.
export const listTickets = asyncHandler(async (req, res) => {
  const { role, region, _id } = req.user;
  let query = {};

  if (role === ROLES.FIELD_AGENT) {
    query = { assignedTo: _id };
  } else if (role === ROLES.REGIONAL_MANAGER) {
    query = { region };
  }
  // NATIONAL_MANAGER / SUPER_ADMIN see everything.

  const tickets = await Ticket.find(query)
    .populate("createdBy", "name email role")
    .populate("assignedTo", "name email role")
    .sort({ createdAt: -1 });

  res.json(tickets);
});

// POST /api/tickets
export const createTicket = asyncHandler(async (req, res) => {
  const { title, description, region, assignedTo } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("A ticket title is required.");
  }

  const ticket = await Ticket.create({
    title,
    description,
    region: region || req.user.region,
    assignedTo: assignedTo || null,
    createdBy: req.user._id
  });

  res.status(201).json(ticket);
});

// PATCH /api/tickets/:id
export const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found.");
  }

  const { status, assignedTo, description } = req.body;
  if (status !== undefined) ticket.status = status;
  if (assignedTo !== undefined) ticket.assignedTo = assignedTo;
  if (description !== undefined) ticket.description = description;

  await ticket.save();
  res.json(ticket);
});
