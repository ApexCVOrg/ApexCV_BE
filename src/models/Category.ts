import mongoose, { Schema, Document } from 'mongoose'
import { CATEGORY_STATUS } from '../constants/categories'

export interface ICategory extends Document {
  name: string
  description?: string
  parentCategory?: mongoose.Types.ObjectId | null
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    status: {
      type: String,
      enum: [CATEGORY_STATUS.ACTIVE, CATEGORY_STATUS.INACTIVE],
      default: CATEGORY_STATUS.ACTIVE
    }
  },
  { timestamps: true }
)

// Add compound index for name and parentCategory to allow same name with different parents
CategorySchema.index({ name: 1, parentCategory: 1 }, { unique: true })

export const Category = mongoose.model<ICategory>('Category', CategorySchema)
