import mongoose, { Schema, Document } from 'mongoose';

interface IPendingUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  fullName: string;
  phone: string;
  addresses: any[];
  verificationCode: string;
  expiresAt: Date;
}

const PendingUserSchema = new Schema<IPendingUser>({
  username: String,
  email: String,
  passwordHash: String,
  fullName: String,
  phone: String,
  addresses: Array,
  verificationCode: String,
  expiresAt: Date,
});

export const PendingUser = mongoose.model<IPendingUser>('PendingUser', PendingUserSchema);
