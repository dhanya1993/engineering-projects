import mongoose from "mongoose";

export const ACTIVITY_TYPES = Object.freeze(["note", "call", "email", "meeting", "stage_change"]);

const activitySchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", default: null, index: true },
    dealId: { type: mongoose.Schema.Types.ObjectId, ref: "Deal", default: null, index: true },
    type: { type: String, enum: ACTIVITY_TYPES, required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

export const Activity = mongoose.model("Activity", activitySchema);
