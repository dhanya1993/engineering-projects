import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", default: null },
    dealId: { type: mongoose.Schema.Types.ObjectId, ref: "Deal", default: null },
    title: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

taskSchema.index({ ownerId: 1, dueDate: 1 });

export const Task = mongoose.model("Task", taskSchema);
