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
}

// Get all products
const getAllProducts: RequestHandler = async (req, res, next) => {
  try {
    const { gender } = req.query as ProductQuery

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
        res.status(404).json({
          message: `Gender category not found: ${genderName}`
        })
        return
      }

      // Find all categories under this gender
      const genderCategories = await Category.find({
        parentCategory: genderCategory._id
      })

      if (!genderCategories.length) {
        res.status(404).json({
          message: `No team categories found for gender: ${genderName}`
        })
        return
      }

      // Get all product type categories under these team categories
      const productTypeCategories = await Category.find({
        parentCategory: { $in: genderCategories.map((cat) => cat._id) }
      })

      if (!productTypeCategories.length) {
        res.status(404).json({
          message: `No product categories found for gender: ${genderName}`
        })
        return
      }

      // Filter products that have any of these categories
      query = query.where('categories').in(productTypeCategories.map((cat) => cat._id))
    }

    const products = await query.populate('categories', 'name').populate('brand', 'name').sort({ createdAt: -1 }).lean()

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

export default router
