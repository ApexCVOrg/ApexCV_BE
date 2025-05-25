import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
  recipientName: String,
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  phone: String,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  fullName: String,
  phone: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  status: String,
  avatar: String,
  addresses: [addressSchema],
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);
