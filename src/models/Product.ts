import mongoose, { Schema } from "mongoose";

const sizeSchema = new Schema({
  size: String,
  stock: Number,
});

const productSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  discountPrice: Number,
  categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  brand: { type: Schema.Types.ObjectId, ref: "Brand" },
  images: [String],
  sizes: [sizeSchema],
  colors: [String],
  tags: [String],
  ratingsAverage: { type: Number, default: 0 },
  ratingsQuantity: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Add virtual for brand name
productSchema.virtual('brandName').get(function() {
  return this.brand ? this.brand.name : 'Unknown Brand';
});

// Add virtual for formatted categories
productSchema.virtual('formattedCategories').get(function() {
  return this.categories ? this.categories.map(cat => ({
    _id: cat._id,
    name: cat.name
  })) : [];
});

// Ensure virtuals are included when converting to JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export const Product = mongoose.model("Product", productSchema);
