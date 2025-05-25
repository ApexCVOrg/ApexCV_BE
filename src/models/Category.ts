import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  parentCategory: { type: Schema.Types.ObjectId, ref: "Category" },
});

export const Category = mongoose.model("Category", categorySchema);
