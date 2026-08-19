import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    company: { type: String, trim: true, default: "" },
    tags: { type: [String], default: [] },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

contactSchema.index({ name: "text", company: "text", email: "text" });

export const Contact = mongoose.model("Contact", contactSchema);
