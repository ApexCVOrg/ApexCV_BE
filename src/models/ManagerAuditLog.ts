import mongoose, { Schema, Document } from 'mongoose';

export interface IManagerAuditLog extends Document {
  managerId: mongoose.Types.ObjectId;
  action: string;
  target: string;
  detail: string;
  ip: string;
  userAgent: string;
  createdAt: Date;
}

const ManagerAuditLogSchema = new Schema<IManagerAuditLog>({
  managerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  target: { type: String, required: true },
  detail: { type: String, required: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IManagerAuditLog>('ManagerAuditLog', ManagerAuditLogSchema); 