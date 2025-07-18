import mongoose, { Schema } from 'mongoose'

const voucherSchema = new Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  expiry: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
})

export const Voucher = mongoose.model('Voucher', voucherSchema) 