import { Category } from '../models/Category'
import { CATEGORY_STATUS } from '../constants/categories'

interface ICategory {
  _id: string
  name: string
  description?: string
  parentCategory?: string | null
  status: string
  createdAt?: Date
  updatedAt?: Date
}

interface CategoryWithSubcategories extends ICategory {
  subcategories?: CategoryWithSubcategories[]
}

export async function getCategoryTree(): Promise<CategoryWithSubcategories[]> {
  try {
    // Get all active categories
    const allCategories = await Category.find({ status: CATEGORY_STATUS.ACTIVE }).lean()

    // Filter root categories (parentCategory = null)
    const rootCategories = allCategories.filter((cat) => !cat.parentCategory)

    // Assign subcategories to each parent
    const categoryTree = rootCategories.map((parent) => ({
      ...parent,
      _id: parent._id.toString(),
      parentCategory: parent.parentCategory?.toString() || null,
      subcategories: allCategories
        .filter((cat) => cat.parentCategory && cat.parentCategory.toString() === parent._id.toString())
        .map((cat) => ({
          ...cat,
          _id: cat._id.toString(),
          parentCategory: cat.parentCategory?.toString() || null
        }))
    }))

    return categoryTree
  } catch (error) {
    console.error('Error getting category tree:', error)
    throw error
  }
}
