import express from 'express'
import type { Request, Response, NextFunction, RequestHandler } from 'express'
import mongoose from 'mongoose'
import { Product } from '../models/Product'
import { Category } from '../models/Category'
import { CATEGORY_MESSAGES } from '../constants/categories'
import { getTopSellingProducts, getPublicTopSellingProducts } from '../controllers/dashboardController'

const router = express.Router()

interface ProductQuery {
  gender?: string
  brand?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  search?: string
}

// Get all products
const getAllProducts: RequestHandler = async (req, res, next) => {
  try {
    console.log('GET /products - Query params:', req.query)
    const { gender, brand, category, minPrice, maxPrice, search } = req.query as ProductQuery

    // Validate gender parameter
    if (gender && !['men', 'women', 'kids'].includes(gender.toString().toLowerCase())) {
      res.status(400).json({
        message: 'Invalid gender parameter. Must be one of: men, women, kids'
      })
      return
    }

    let query = Product.find()

    if (gender) {
      const genderName = gender.toString().toLowerCase()

      // Find the gender category
      const genderCategory = await Category.findOne({
        name: genderName.charAt(0).toUpperCase() + genderName.slice(1),
        parentCategory: null
      })

      if (!genderCategory) {
        console.log(`Gender category not found: ${genderName}, returning all products`)
        // Don't return 404, just continue with all products
      } else {
        console.log('Found gender category:', genderCategory.name)
        
        // Find all categories under this gender
        const genderCategories = await Category.find({
          parentCategory: genderCategory._id
        })

        if (genderCategories.length > 0) {
          console.log(`Found ${genderCategories.length} team categories`)
          
          // Get all product type categories under these team categories
          const productTypeCategories = await Category.find({
            parentCategory: { $in: genderCategories.map((cat) => cat._id) }
          })

          if (productTypeCategories.length > 0) {
            console.log(`Found ${productTypeCategories.length} product categories`)
            // Filter products that have any of these categories
            query = query.where('categories').in(productTypeCategories.map((cat) => cat._id))
          } else {
            console.log('No product categories found, returning all products')
          }
        } else {
          console.log('No team categories found, returning all products')
        }
      }
    }

    // Handle brand filtering
    if (brand) {
      console.log('Filtering by brand:', brand)
      const brandIds = brand.split(',').map(id => id.trim())
      // Validate brand IDs are valid ObjectIds
      const validBrandIds = brandIds.filter(id => /^[0-9a-fA-F]{24}$/.test(id))
      if (validBrandIds.length > 0) {
        query = query.where('brand').in(validBrandIds)
      }
    }

    // Handle category filtering
    if (category) {
      console.log('Filtering by category:', category)
      const categoryIds = category.split(',').map(id => id.trim())
      // Validate category IDs are valid ObjectIds
      const validCategoryIds = categoryIds.filter(id => /^[0-9a-fA-F]{24}$/.test(id))
      if (validCategoryIds.length > 0) {
        query = query.where('categories').in(validCategoryIds)
      }
    }

    // Handle price filtering
    if (minPrice || maxPrice) {
      console.log('Filtering by price range:', minPrice, '-', maxPrice)
      const priceFilter: any = {}
      if (minPrice) priceFilter.$gte = parseFloat(minPrice)
      if (maxPrice) priceFilter.$lte = parseFloat(maxPrice)
      query = query.where('price', priceFilter)
    }

    // Handle search filtering
    if (search) {
      console.log('Filtering by search:', search)
      query = query.where('name', { $regex: search, $options: 'i' })
    }

    console.log('Final query conditions:', query.getQuery())
    
    const products = await query.populate('categories', 'name').populate('brand', 'name').sort({ createdAt: -1 }).lean()

    console.log('Products found:', products.length)

    res.json({
      success: true,
      count: products.length,
      data: products
    })
  } catch (error: any) {
    next(error)
  }
}

router.get('/', getAllProducts)

// Create product
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, price, discountPrice, categories, brand, images, sizes, colors, tags, label, status } =
      req.body
    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      categories,
      brand,
      images,
      sizes,
      colors,
      tags
    })
    const saved = await product.save()
    const populated = await saved.populate([
      { path: 'categories', select: 'name' },
      { path: 'brand', select: 'name' }
    ])
    res.status(201).json({ ...populated.toObject(), message: 'Product created successfully!' })
  } catch (error: any) {
    res.status(400).json({ message: 'Error creating product', error: error?.message || 'Unknown error' })
  }
})

// Update product
router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params
    const updateData = req.body
    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true })
      .populate('categories', 'name')
      .populate('brand', 'name')
    if (!updated) {
      res.status(404).json({ message: 'Product not found' })
      return
    }
    res.json({ ...updated.toObject(), message: 'Product updated successfully!' })
  } catch (error: any) {
    res.status(400).json({ message: 'Error updating product', error: error?.message || 'Unknown error' })
  }
})

// Delete product
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await Product.findByIdAndDelete(id)
    if (!deleted) {
      res.status(404).json({ message: 'Product not found' })
      return
    }
    res.json({ message: 'Product deleted successfully!' })
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting product', error: error?.message || 'Unknown error' })
  }
})

// Top-selling products
router.get('/top-selling', (req, res, next) => getTopSellingProducts(req, res));

// Public Top-selling products
router.get('/public-top-selling', getPublicTopSellingProducts);

// Get product by ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid product ID format' 
      })
    }

    const product = await Product.findById(id)
      .populate('categories', 'name')
      .populate('brand', 'name')
      .lean()

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      })
    }

    res.json({
      success: true,
      data: product
    })
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching product', 
      error: error?.message || 'Unknown error' 
    })
  }
})

export default router