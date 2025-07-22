import mongoose, { Schema, Document } from 'mongoose';

export interface IRefundRequest extends Document {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  txnRef: string;
  amount: number;
  reason: string;
  status: 'pending' | 'accepted' | 'rejected';
  managerId?: mongoose.Types.ObjectId;
  rejectReason?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const RefundRequestSchema = new Schema<IRefundRequest>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  txnRef: { type: String, required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  managerId: { type: Schema.Types.ObjectId, ref: 'User' },
  rejectReason: { type: String },
  images: [{ type: String }],
}, {
  timestamps: true,
});

export default mongoose.model<IRefundRequest>('RefundRequest', RefundRequestSchema); 