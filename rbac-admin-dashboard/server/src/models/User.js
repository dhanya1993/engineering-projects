import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ROLES } from "../utils/permissions.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.VIEWER,
      required: true
    },
    // The manager this user reports to — lets the UI render an org tree
    // and lets "manage users below me" queries scope by reporting line.
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    region: { type: String, default: null },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    managerId: this.managerId,
    region: this.region,
    isActive: this.isActive,
    createdAt: this.createdAt
  };
};

export const User = mongoose.model("User", userSchema);
