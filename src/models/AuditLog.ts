import mongoose, { Schema, Document } from 'mongoose'

export interface IAuditLog extends Document {
  adminId: mongoose.Types.ObjectId
  action: string
  target: string
  detail: string
  ip: string
  userAgent: string
  createdAt: Date
}

const AuditLogSchema = new Schema<IAuditLog>({
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  target: { type: String, required: true },
  detail: { type: String, required: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema)
