import mongoose, { Schema } from 'mongoose';

const brandSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  logo: String, // URL hình logo thương hiệu
  website: String, // Link website chính thức
  createdAt: { type: Date, default: Date.now },
});

export const Brand = mongoose.model('Brand', brandSchema);
