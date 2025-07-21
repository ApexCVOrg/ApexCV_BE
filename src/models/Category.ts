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

// Remove all old indexes
CategorySchema.indexes().forEach((index) => {
  CategorySchema.index(index[0], { ...index[1], unique: false })
})

// Add compound index for name and parentCategory to allow same name with different parents
CategorySchema.index({ name: 1, parentCategory: 1 }, { unique: true })

// Function to ensure indexes are properly set up
export const ensureCategoryIndexes = async () => {
  try {
    // Drop all existing indexes
    await Category.collection.dropIndexes()
    // Dropped all existing category indexes

    // Create new compound index
    await Category.collection.createIndex({ name: 1, parentCategory: 1 }, { unique: true })
    // Created new category compound index
  } catch (error) {
    console.error('❌ Error setting up category indexes:', error)
    throw error
  }
}

export const Category = mongoose.model<ICategory>('Category', CategorySchema)
