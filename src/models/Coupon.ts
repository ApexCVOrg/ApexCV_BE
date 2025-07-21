import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxUsage: number;
  used: number;
  expiresAt: Date;
  isActive: boolean;
}

const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true, trim: true },
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  value: { type: Number, required: true },
  minOrderValue: { type: Number, required: true },
  maxUsage: { type: Number, required: true },
  used: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

CouponSchema.pre('save', function (next) {
  if (this.expiresAt < new Date() || this.used >= this.maxUsage) {
    this.isActive = false;
  }
  next();
});

export const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema);
