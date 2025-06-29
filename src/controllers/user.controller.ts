import { Request, Response } from 'express'
import { User } from '../models/User'

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const user = await User.findById(userId).select('-passwordHash -verificationCode -verificationCodeExpires')
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
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      isVerified: user.isVerified
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

    const { fullName, phone, addresses } = req.body

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

    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    // Update user fields
    if (fullName) user.fullName = fullName
    if (phone) user.phone = phone
    if (addresses) user.addresses = addresses

    await user.save()

    // Trả về thông tin mới nhất
    const updatedUser = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      addresses: user.addresses,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      isVerified: user.isVerified
    }

    res.json(updatedUser)
  } catch (error) {
    console.error('Error in updateProfile:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
