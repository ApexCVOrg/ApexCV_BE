import mongoose, { Schema, Document } from 'mongoose'

const transactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['sepay_payment', 'points_used', 'points_earned', 'refund'], 
    required: true 
  },
  amount: { type: Number, required: true }, // Số tiền giao dịch (VND)
  points: { type: Number, required: true }, // Số điểm thay đổi (+ hoặc -)
  transactionId: { type: String }, // Mã giao dịch từ bên thứ 3
  sessionId: { type: String }, // Session ID cho Sepay
  description: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'cancelled'], 
    default: 'pending' 
  },
  metadata: { type: Schema.Types.Mixed }, // Thông tin bổ sung
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Indexes
transactionSchema.index({ userId: 1, createdAt: -1 })
transactionSchema.index({ transactionId: 1 })
transactionSchema.index({ sessionId: 1 })

// Update updatedAt on save
transactionSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

// Update updatedAt on update operations
transactionSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function (next) {
  this.set({ updatedAt: new Date() })
  next()
})

interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId
  type: 'sepay_payment' | 'points_used' | 'points_earned' | 'refund'
  amount: number
  points: number
  transactionId?: string
  sessionId?: string
  description?: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  metadata?: any
  createdAt: Date
  updatedAt: Date
}

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema)
