import asyncHandler from "express-async-handler";
import { Task } from "../models/Task.js";

// GET /api/tasks?status=overdue|today|upcoming|completed
export const listTasks = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = { ownerId: req.user._id };

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  if (status === "completed") {
    query.completed = true;
  } else if (status === "overdue") {
    query.completed = false;
    query.dueDate = { $lt: startOfToday };
  } else if (status === "today") {
    query.completed = false;
    query.dueDate = { $gte: startOfToday, $lte: endOfToday };
  } else if (status === "upcoming") {
    query.completed = false;
    query.dueDate = { $gt: endOfToday };
  }

  const tasks = await Task.find(query)
    .populate("contactId", "name")
    .populate("dealId", "title")
    .sort({ dueDate: 1 });

  res.json(tasks);
});

// POST /api/tasks
export const createTask = asyncHandler(async (req, res) => {
  const { title, dueDate, contactId, dealId } = req.body;
  if (!title || !dueDate) {
    res.status(400);
    throw new Error("title and dueDate are required.");
  }

  const task = await Task.create({
    ownerId: req.user._id,
    title,
    dueDate,
    contactId: contactId || null,
    dealId: dealId || null
  });

  res.status(201).json(task);
});

// PATCH /api/tasks/:id
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, ownerId: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error("Task not found.");
  }

  const { title, dueDate, completed } = req.body;
  if (title !== undefined) task.title = title;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (completed !== undefined) task.completed = completed;

  await task.save();
  res.json(task);
});

// DELETE /api/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error("Task not found.");
  }
  res.json({ deleted: true });
});
