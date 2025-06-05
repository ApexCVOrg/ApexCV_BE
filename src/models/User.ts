import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
  recipientName: String,
  street: String,
  city: String,
  state: String,
  country: String,
  phone: String,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: false },
  fullName: String,
  phone: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  status: String,
  avatar: String,
  addresses: [addressSchema],
  googleId: { type: String, unique: true, sparse: true },
  facebookId: { type: String, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now },
});
  interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  fullName: string;
  phone: string;
  addresses: any[];
  role: string;
}
export const User = mongoose.model("User", userSchema);
