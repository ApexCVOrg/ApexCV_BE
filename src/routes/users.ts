import express, { Request, Response, Router } from "express";
import { User } from "../models/User";
import { authenticateToken } from "../middlewares/auth";
import { checkPermission, checkPermissions } from "../middlewares/permission";
import { Permission } from "../types/filter/permissions";
import { getProfile, updateProfile } from "../controllers/user.controller";

const router: Router = express.Router()

// Apply authentication middleware to all routes
router.use(authenticateToken)

// Get user profile
router.get('/profile', getProfile);
// Update user profile
router.put('/profile', updateProfile);

// Get all users (admin only)
router.get('/', checkPermission(Permission.MANAGE_USERS), async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-passwordHash')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' })
  }
})

// Create new user (admin only)
router.post('/', checkPermission(Permission.MANAGE_USERS), async (req: Request, res: Response) => {
  try {
    const { username, email, passwordHash, fullName, phone, role, status, avatar, addresses } = req.body

    if (!username || !email || !passwordHash) {
      res.status(400).json({ message: 'username, email và passwordHash là bắt buộc' })
      return
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({ message: 'Email đã được đăng ký' })
      return
    }

    const user = new User({
      username,
      email,
      passwordHash,
      fullName,
      phone,
      role,
      status,
      avatar,
      addresses
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi tạo người dùng: ' + (error as Error).message })
  }
})

// Update user (admin only)
router.put('/:id', checkPermission(Permission.MANAGE_USERS), async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Prevent updating sensitive fields
    delete updateData.passwordHash
    delete updateData.email

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-passwordHash')
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' })
  }
})

// Delete user (admin only)
router.delete('/:id', checkPermission(Permission.MANAGE_USERS), async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' })
  }
})

export default router
