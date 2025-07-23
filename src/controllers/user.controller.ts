import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { User } from '../models/User'
import { Product } from '../models/Product'

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const user = await User.findById(userId)
      .select('-passwordHash -verificationCode -verificationCodeExpires')
      .populate('favorites', 'name price images brand categories status')

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    // Trả về đầy đủ thông tin cho FE
    const formattedUser = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      addresses: user.addresses, // trả về mảng đầy đủ
      favorites: user.favorites, // thêm favorites
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      isVerified: user.isVerified,
      // Body measurements for size recommendation
      height: user.height,
      weight: user.weight,
      footLength: user.footLength
    }

    res.json(formattedUser)
  } catch (error) {
    console.error('Error in getProfile:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const { fullName, phone, addresses, height, weight, footLength } = req.body

    // Validate input
    if (fullName && typeof fullName !== 'string') {
      res.status(400).json({ message: 'Invalid fullName format' })
      return
    }
    if (phone && typeof phone !== 'string') {
      res.status(400).json({ message: 'Invalid phone format' })
      return
    }
    if (addresses && !Array.isArray(addresses)) {
      res.status(400).json({ message: 'Invalid addresses format' })
      return
    }
    if (height !== undefined && (typeof height !== 'number' || height < 100 || height > 250)) {
      res.status(400).json({ message: 'Invalid height format (must be between 100-250 cm)' })
      return
    }
    if (weight !== undefined && (typeof weight !== 'number' || weight < 20 || weight > 200)) {
      res.status(400).json({ message: 'Invalid weight format (must be between 20-200 kg)' })
      return
    }
    if (footLength !== undefined && (typeof footLength !== 'number' || footLength < 150 || footLength > 350)) {
      res.status(400).json({ message: 'Invalid footLength format (must be between 150-350 mm)' })
      return
    }

    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    // Update user fields
    if (fullName) user.fullName = fullName
    if (phone) user.phone = phone
    if (addresses) user.addresses = addresses
    if (height !== undefined) user.height = height
    if (weight !== undefined) user.weight = weight
    if (footLength !== undefined) user.footLength = footLength

    await user.save()

    // Trả về thông tin mới nhất
    const updatedUser = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      addresses: user.addresses,
      favorites: user.favorites, // thêm favorites
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      isVerified: user.isVerified,
      // Body measurements for size recommendation
      height: user.height,
      weight: user.weight,
      footLength: user.footLength
    }

    res.json(updatedUser)
  } catch (error) {
    console.error('Error in updateProfile:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Favorites functions
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
        'name description price discountPrice images brand categories sizes colors tags status ratingsAverage ratingsQuantity',
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
      res.status(400).json({ message: 'Product is already in favorites' })
      return
    }

    // Add to favorites
    user.favorites.push(productObjectId)
    await user.save()

    // Populate favorites for response
    await user.populate({
      path: 'favorites',
      select:
        'name description price discountPrice images brand categories sizes colors tags status ratingsAverage ratingsQuantity',
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
      res.status(400).json({ message: 'Product is not in favorites' })
      return
    }

    // Remove from favorites
    user.favorites = user.favorites.filter((fav) => !fav.equals(productObjectId))
    await user.save()

    // Populate favorites for response
    await user.populate({
      path: 'favorites',
      select:
        'name description price discountPrice images brand categories sizes colors tags status ratingsAverage ratingsQuantity',
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

// Lịch sử mua hàng của user
export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }
    const orders = await (
      await import('../models/Order.js')
    ).Order.find({ user: userId })
      .populate({
        path: 'orderItems.product',
        select: 'name price discountPrice images brand categories',
        populate: [
          { path: 'brand', select: 'name' },
          { path: 'categories', select: 'name' }
        ]
      })
      .sort({ createdAt: -1 })
    res.json({ success: true, data: orders })
  } catch (error) {
    console.error('Error in getUserOrders:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
