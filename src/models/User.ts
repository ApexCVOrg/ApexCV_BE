import mongoose, { Schema, Document } from 'mongoose';

const addressSchema = new Schema({
  recipientName: String,
  street: String,
  city: String,
  state: String,
  country: String,
  addressNumber: String,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: false },
  fullName: String,
  phone: String,
  role: { type: String, enum: ['user', 'admin', 'manager'], default: 'user' },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  banReason: { type: String, default: '' },
  avatar: String,
  addresses: [addressSchema],
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  googleId: { type: String, unique: true, sparse: true },
  facebookId: { type: String, unique: true, sparse: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
  verificationCodeExpires: Date,
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update updatedAt on save
userSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Update updatedAt on update operations
userSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

interface IUser extends Document {
  username: string;
  email: string;
  passwordHash?: string;
  fullName?: string;
  phone?: string;
  addresses: any[];
  favorites: mongoose.Types.ObjectId[];
  role: string;
  status: string;
  banReason?: string;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  googleId?: string;
  facebookId?: string;
  avatar?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const User = mongoose.model<IUser>('User', userSchema);
