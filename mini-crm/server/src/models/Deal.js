import mongoose from "mongoose";

export const DEAL_STAGES = Object.freeze([
  "lead",
  "contacted",
  "proposal",
  "negotiation",
  "won",
  "lost"
]);

const dealSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", default: null },
    title: { type: String, required: true, trim: true },
    value: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "USD" },
    stage: { type: String, enum: DEAL_STAGES, default: "lead" },
    // Position within its stage column — lets the kanban board preserve
    // manual drag-and-drop ordering instead of always sorting by date.
    position: { type: Number, default: 0 },
    expectedCloseDate: { type: Date, default: null }
  },
  { timestamps: true }
);

dealSchema.index({ ownerId: 1, stage: 1, position: 1 });

export const Deal = mongoose.model("Deal", dealSchema);
