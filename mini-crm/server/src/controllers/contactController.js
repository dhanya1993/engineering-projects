import asyncHandler from "express-async-handler";
import { Contact } from "../models/Contact.js";

// GET /api/contacts?search=
export const listContacts = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const query = { ownerId: req.user._id };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  const contacts = await Contact.find(query).sort({ updatedAt: -1 });
  res.json(contacts);
});

// GET /api/contacts/:id
export const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params.id, ownerId: req.user._id });
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found.");
  }
  res.json(contact);
});

// POST /api/contacts
export const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, company, tags, notes } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("A contact name is required.");
  }
  const contact = await Contact.create({
    ownerId: req.user._id,
    name,
    email,
    phone,
    company,
    tags,
    notes
  });
  res.status(201).json(contact);
});

// PATCH /api/contacts/:id
export const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params.id, ownerId: req.user._id });
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found.");
  }

  const { name, email, phone, company, tags, notes } = req.body;
  if (name !== undefined) contact.name = name;
  if (email !== undefined) contact.email = email;
  if (phone !== undefined) contact.phone = phone;
  if (company !== undefined) contact.company = company;
  if (tags !== undefined) contact.tags = tags;
  if (notes !== undefined) contact.notes = notes;

  await contact.save();
  res.json(contact);
});

// DELETE /api/contacts/:id
export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id });
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found.");
  }
  res.json({ deleted: true });
});
