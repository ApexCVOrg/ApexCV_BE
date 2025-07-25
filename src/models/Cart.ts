import mongoose, { Schema } from 'mongoose'

const cartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  size: String,
  color: String,
  quantity: { type: Number, required: true, min: 1 }
})

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  cartItems: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now }
})

// Add index for cartItems.product only (user already has unique constraint)
cartSchema.index({ 'cartItems.product': 1 });

export const Cart = mongoose.model('Cart', cartSchema)
