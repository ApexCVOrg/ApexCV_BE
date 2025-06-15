import mongoose, { Schema, Document } from "mongoose";

interface ICategory {
  _id: mongoose.Types.ObjectId;
  name: string;
}

interface IBrand {
  _id: mongoose.Types.ObjectId;
  name: string;
}

interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  categories: mongoose.Types.ObjectId[] | ICategory[];
  brand: mongoose.Types.ObjectId | IBrand;
  images: string[];
  sizes: { size: string; stock: number }[];
  colors: string[];
  tags: string[];
  ratingsAverage: number;
  ratingsQuantity: number;
  createdAt: Date;
}

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

// Add virtual for brand name
productSchema.virtual('brandName').get(function(this: IProduct) {
  const brand = this.brand as IBrand;
  return brand?.name || 'Unknown Brand';
});

// Add virtual for formatted categories
productSchema.virtual('formattedCategories').get(function(this: IProduct) {
  const categories = this.categories as ICategory[];
  return categories ? categories.map(cat => ({
    _id: cat._id,
    name: cat.name
  })) : [];
});

// Ensure virtuals are included when converting to JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export const Product = mongoose.model<IProduct>("Product", productSchema);
