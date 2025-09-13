import express, { Request, Response, Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { User } from '../models/User'
import { authenticateToken } from '../middlewares/auth'
import { checkPermission } from '../middlewares/permission'
import { Permission } from '../types/filter/permissions'
import {
  getProfile,
  updateProfile,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  checkFavorite
} from '../controllers/user.controller'

const router: Router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/avatars')
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// Apply authentication middleware to all routes
router.use(authenticateToken)

// Get user profile
router.get('/profile', getProfile)
// Update user profile
router.put('/profile', updateProfile)
// Test static file serving
router.get('/test-avatar/:filename', (req: Request, res: Response) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../../uploads/avatars', filename);
  
  console.log('Testing avatar file:', {
    filename,
    filePath,
    exists: require('fs').existsSync(filePath)
  });
  
  if (require('fs').existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'Avatar file not found' });
  }
});

// Upload avatar
router.post('/profile/avatar', upload.single('avatar'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const userId = (req as any).user.id
    // Use localhost for development, production URL for production
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? (process.env.API_BASE_URL || 'https://nidas-be.onrender.com')
      : 'http://localhost:5000'
    const avatarUrl = `${baseUrl}/uploads/avatars/${req.file.filename}`

    console.log('Avatar upload debug:', {
      userId,
      filename: req.file.filename,
      avatarUrl,
      filePath: req.file.path
    });

    // Update user's avatar
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    ).select('-passwordHash')

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    console.log('Updated user avatar:', updatedUser.avatar);

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      data: {
        avatar: avatarUrl,
        user: updatedUser
      }
    })
  } catch (error) {
    console.error('Avatar upload error:', error)
    res.status(500).json({ message: 'Error uploading avatar' })
  }
})

// Favorites routes
router.get('/favorites', getFavorites)
router.post('/favorites/add/:productId', addToFavorites)
router.delete('/favorites/remove/:productId', removeFromFavorites)
router.get('/favorites/check/:productId', checkFavorite)

// Lấy lịch sử mua hàng của user (tạm thời trả về rỗng để tránh crash nếu controller chưa có)
router.get('/orders', async (_req: Request, res: Response) => {
  res.json({ success: true, orders: [] })
})

// Get all users (admin only)
router.get('/', checkPermission(Permission.MANAGE_USERS), async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-passwordHash')
    res.json(users)
  } catch {
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
  } catch {
    res.status(400).json({ message: 'Lỗi khi tạo người dùng' })
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
  } catch {
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
  } catch {
    res.status(500).json({ message: 'Error deleting user' })
  }
})

export default router
