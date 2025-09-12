import express, { Request, Response, Router } from 'express'
import { authenticateToken } from '../../middlewares/auth'
import { checkPermission, checkAnyPermission } from '../../middlewares/permission'
import { Permission } from '../../types/filter/permissions'
import { User } from '../../models/User'
import bcrypt from 'bcryptjs'

const router: Router = express.Router()

// Apply authentication middleware to all routes
router.use(authenticateToken)

// Get all users (admin and manager)
router.get(
  '/',
  checkAnyPermission([Permission.MANAGE_USERS, Permission.VIEW_ALL_USERS]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { role, search, page = 1, limit = 10 } = req.query
      const query: { role?: string; $or?: Array<{ [key: string]: { $regex: string; $options: string } }> } = {}

      // Filter by role if specified
      if (role) {
        query.role = String(role)
      }

      // Search by username, email or fullName
      if (search) {
        query.$or = [
          { username: { $regex: String(search), $options: 'i' } },
          { email: { $regex: String(search), $options: 'i' } },
          { fullName: { $regex: String(search), $options: 'i' } }
        ]
      }

      const skip = (Number(page) - 1) * Number(limit)

      const [users, total] = await Promise.all([
        User.find(query).select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
        User.countDocuments(query)
      ])

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit))
          }
        }
      })
    } catch (error) {
      console.error('Error fetching users:', error)
      res.status(500).json({
        success: false,
        message: 'Error fetching users'
      })
    }
  }
)

// Get user by ID (admin and manager)
router.get(
  '/:id',
  checkAnyPermission([Permission.MANAGE_USERS, Permission.VIEW_ALL_USERS]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.id).select('-passwordHash')
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        })
        return
      }
      res.json({
        success: true,
        data: user
      })
    } catch (error) {
      console.error('Error fetching user:', error)
      res.status(500).json({
        success: false,
        message: 'Error fetching user'
      })
    }
  }
)

// Create new user (admin only)
router.post('/', checkPermission(Permission.MANAGE_USERS), async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, fullName, phone, role, status, avatar, addresses } = req.body

    // Validate required fields
    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Username, email and password are required'
      })
      return
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      })
      return
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create new user
    const user = new User({
      username,
      email,
      passwordHash,
      fullName,
      phone,
      role: role || 'user',
      status,
      avatar,
      addresses,
      isVerified: true // Admin created users are pre-verified
    })

    const savedUser = await user.save()

    res.status(201).json({
      success: true,
      data: {
        ...savedUser.toObject(),
        passwordHash: undefined
      }
    })
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating user'
    })
  }
})

// Update user (admin only)
router.put('/:id', checkPermission(Permission.MANAGE_USERS), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Prevent updating sensitive fields
    delete updateData.passwordHash
    delete updateData.email

    // If password is provided, hash it
    if (updateData.password) {
      updateData.passwordHash = await bcrypt.hash(updateData.password, 10)
      delete updateData.password
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-passwordHash')

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      })
      return
    }

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    })
  }
})

// Delete user (admin only)
router.delete('/:id', checkPermission(Permission.MANAGE_USERS), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    // Prevent deleting self
    if (id === req.user?._id.toString()) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      })
      return
    }

    const user = await User.findByIdAndDelete(id)

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      })
      return
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    })
  }
})

// Change user status (admin only)
router.patch(
  '/:id/status',
  checkPermission(Permission.MANAGE_USERS),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const { status } = req.body

      if (!status) {
        res.status(400).json({
          success: false,
          message: 'Status is required'
        })
        return
      }

      const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select('-passwordHash')

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        })
        return
      }

      res.json({
        success: true,
        data: user
      })
    } catch (error) {
      console.error('Error updating user status:', error)
      res.status(500).json({
        success: false,
        message: 'Error updating user status'
      })
    }
  }
)

export default router
