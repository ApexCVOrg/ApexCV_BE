import mongoose, { Schema } from 'mongoose'

const sizeSchema = new Schema({
  size: String,
  stock: Number
})

const productSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  discountPrice: Number,
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
  images: [String],
  sizes: [sizeSchema],
  colors: [String],
  tags: [String],
  label: [String],
  ratingsAverage: { type: Number, default: 0 },
  ratingsQuantity: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
})

export const Product = mongoose.model('Product', productSchema)
