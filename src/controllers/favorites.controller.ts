import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { User } from '../models/User'
import { Product } from '../models/Product'

// Get all favorites of current user
export const getFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const user = await User.findById(userId).populate({
      path: 'favorites',
      select:
        'name description price discountPrice images brand categories sizes colors tags status ratingsAverage ratingsQuantity createdAt',
      populate: [
        { path: 'brand', select: 'name' },
        { path: 'categories', select: 'name' }
      ]
    })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json({
      success: true,
      data: {
        favorites: user.favorites,
        count: user.favorites.length
      }
    })
  } catch (error) {
    console.error('Error in getFavorites:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Add product to favorites
export const addToFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id
    const { productId } = req.params

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!productId) {
      res.status(400).json({ message: 'Product ID is required' })
      return
    }

    // Check if product exists
    const product = await Product.findById(productId)
    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }

    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    // Convert string to ObjectId for comparison
    const productObjectId = new mongoose.Types.ObjectId(productId)

    // Check if product is already in favorites
    if (user.favorites.some((fav) => fav.equals(productObjectId))) {
      res.status(400).json({
        success: false,
        message: 'Product is already in favorites'
      })
      return
    }

    // Add to favorites
    user.favorites.push(productObjectId)
    await user.save()

    // Populate favorites for response
    await user.populate({
      path: 'favorites',
      select:
        'name description price discountPrice images brand categories sizes colors tags status ratingsAverage ratingsQuantity createdAt',
      populate: [
        { path: 'brand', select: 'name' },
        { path: 'categories', select: 'name' }
      ]
    })

    res.json({
      success: true,
      message: 'Product added to favorites successfully',
      data: {
        favorites: user.favorites,
        count: user.favorites.length
      }
    })
  } catch (error) {
    console.error('Error in addToFavorites:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Remove product from favorites
export const removeFromFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id
    const { productId } = req.params

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!productId) {
      res.status(400).json({ message: 'Product ID is required' })
      return
    }

    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    // Convert string to ObjectId for comparison
    const productObjectId = new mongoose.Types.ObjectId(productId)

    // Check if product is in favorites
    if (!user.favorites.some((fav) => fav.equals(productObjectId))) {
      res.status(400).json({
        success: false,
        message: 'Product is not in favorites'
      })
      return
    }

    // Remove from favorites
    user.favorites = user.favorites.filter((fav) => !fav.equals(productObjectId))
    await user.save()

    // Populate favorites for response
    await user.populate({
      path: 'favorites',
      select:
        'name description price discountPrice images brand categories sizes colors tags status ratingsAverage ratingsQuantity createdAt',
      populate: [
        { path: 'brand', select: 'name' },
        { path: 'categories', select: 'name' }
      ]
    })

    res.json({
      success: true,
      message: 'Product removed from favorites successfully',
      data: {
        favorites: user.favorites,
        count: user.favorites.length
      }
    })
  } catch (error) {
    console.error('Error in removeFromFavorites:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Check if product is in favorites
export const checkFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id
    const { productId } = req.params

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!productId) {
      res.status(400).json({ message: 'Product ID is required' })
      return
    }

    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    // Convert string to ObjectId for comparison
    const productObjectId = new mongoose.Types.ObjectId(productId)
    const isFavorite = user.favorites.some((fav) => fav.equals(productObjectId))

    res.json({
      success: true,
      data: {
        isFavorite,
        productId
      }
    })
  } catch (error) {
    console.error('Error in checkFavorite:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Toggle favorite status (add if not exists, remove if exists)
export const toggleFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id
    const { productId } = req.params

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!productId) {
      res.status(400).json({ message: 'Product ID is required' })
      return
    }

    // Check if product exists
    const product = await Product.findById(productId)
    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }

    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    // Convert string to ObjectId for comparison
    const productObjectId = new mongoose.Types.ObjectId(productId)
    const isFavorite = user.favorites.some((fav) => fav.equals(productObjectId))

    if (isFavorite) {
      // Remove from favorites
      user.favorites = user.favorites.filter((fav) => !fav.equals(productObjectId))
    } else {
      // Add to favorites
      user.favorites.push(productObjectId)
    }

    await user.save()

    // Populate favorites for response
    await user.populate({
      path: 'favorites',
      select:
        'name description price discountPrice images brand categories sizes colors tags status ratingsAverage ratingsQuantity createdAt',
      populate: [
        { path: 'brand', select: 'name' },
        { path: 'categories', select: 'name' }
      ]
    })

    res.json({
      success: true,
      message: isFavorite ? 'Product removed from favorites' : 'Product added to favorites',
      data: {
        favorites: user.favorites,
        count: user.favorites.length,
        isFavorite: !isFavorite
      }
    })
  } catch (error) {
    console.error('Error in toggleFavorite:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Clear all favorites
export const clearFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    // Clear all favorites
    user.favorites = []
    await user.save()

    res.json({
      success: true,
      message: 'All favorites cleared successfully',
      data: {
        favorites: [],
        count: 0
      }
    })
  } catch (error) {
    console.error('Error in clearFavorites:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
