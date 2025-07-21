import { Request, Response } from 'express'
import { Product } from '../models/Product'
import { Category } from '../models/Category'
import { Order } from '../models/Order'
import { User } from '../models/User'
import { CATEGORY_MESSAGES } from '../constants/categories'
import { Brand } from '../models/Brand'
import bcrypt from 'bcryptjs'
import { logAdminAction } from '../utils/logAdminAction'
import { sendBanUserEmail } from '../services/email.service'

/* -------------------------------- Dashboard ------------------------------- */
export const getDashboard = async (_req: Request, res: Response) => {
  try {
    const [totalUsers, totalOrders, totalProducts] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments()
    ])
    res.json({ totalUsers, totalOrders, totalProducts })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

/* -------------------------------- Products -------------------------------- */
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .populate({
        path: 'categories',
        populate: {
          path: 'parentCategory',
          select: 'name',
          populate: { path: 'parentCategory', select: 'name' }
        }
      })
      .populate('brand', 'name')
      .sort({ createdAt: -1 })
      .lean()
    res.json(products)
  } catch (error: unknown) {
    res.status(500).json({
      message: 'Error fetching products',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categories', 'name')
      .populate({ path: 'brand', select: 'name', strictPopulate: false })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = new Product(req.body)
    const savedProduct = await newProduct.save()
    // Audit log
    await logAdminAction(req, {
      adminId: req.user?._id,
      action: 'CREATE_PRODUCT',
      target: savedProduct && savedProduct._id ? String(savedProduct._id) : '',
      detail: `Created product: ${savedProduct.name}`
    })
    res.status(201).json(savedProduct)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    // Audit log
    await logAdminAction(req, {
      adminId: req.user?._id,
      action: 'UPDATE_PRODUCT',
      target: req.params.id,
      detail: `Updated product: ${updatedProduct?.name}`
    })
    res.json(updatedProduct)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    // Audit log
    await logAdminAction(req, {
      adminId: req.user?._id,
      action: 'DELETE_PRODUCT',
      target: req.params.id,
      detail: `Deleted product: ${req.params.id}`
    })
    res.json({ message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

/* ------------------------------- Categories ------------------------------- */
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find().populate('parentCategory', 'name')
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ message: 'Category not found' })
    res.json(category)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, parentCategory, status } = req.body
    const category = new Category({
      name,
      description,
      parentCategory: parentCategory || null,
      status
    })
    const saved = await category.save()
    res.status(201).json({ ...saved.toObject(), message: CATEGORY_MESSAGES.CREATE_SUCCESS })
  } catch (error: unknown) {
    console.error('Error creating category:', error)
    res.status(400).json({ message: CATEGORY_MESSAGES.ERROR, error: error instanceof Error ? error.message : 'Unknown error' })
  }
}

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, description, parentCategory, status } = req.body

    if (id === parentCategory) {
      return res.status(400).json({ message: 'Category cannot be its own parent' })
    }

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, description, parentCategory: parentCategory || null, status },
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ message: CATEGORY_MESSAGES.ERROR })
    }

    res.json({ ...updated.toObject(), message: CATEGORY_MESSAGES.UPDATE_SUCCESS })
  } catch (error: unknown) {
    console.error('Error updating category:', error)
    res.status(400).json({ message: CATEGORY_MESSAGES.ERROR, error: error instanceof Error ? error.message : 'Unknown error' })
  }
}

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await Category.findByIdAndDelete(req.params.id)
    res.json({ message: 'Category deleted' })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

/* -------------------------------- Orders ---------------------------------- */
export const getOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate('user').populate('orderItems.product').sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('user').populate('orderItems.product')
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    // Chỉ update các trường hợp lệ
    const updateData: any = {}
    if ('orderStatus' in req.body) updateData.orderStatus = req.body.orderStatus
    if ('isPaid' in req.body) updateData.isPaid = req.body.isPaid
    if ('isDelivered' in req.body) updateData.isDelivered = req.body.isDelivered
    if ('shippingPrice' in req.body) updateData.shippingPrice = req.body.shippingPrice
    if ('taxPrice' in req.body) updateData.taxPrice = req.body.taxPrice
    // Có thể bổ sung các trường khác nếu cần

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true })
    // Audit log
    await logAdminAction(req, {
      adminId: req.user?._id,
      action: 'UPDATE_ORDER',
      target: req.params.id,
      detail: `Updated order: ${JSON.stringify(updateData)}`
    })
    res.json(updatedOrder)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    // Audit log
    await logAdminAction(req, {
      adminId: req.user?._id,
      action: 'DELETE_ORDER',
      target: req.params.id,
      detail: `Deleted order: ${req.params.id}`
    })
    res.json({ message: 'Order deleted' })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

/* ------------------------------- Customers -------------------------------- */
export const getCustomers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const customers = await User.find({ role: 'user' })
      .select('username email fullName phone role isVerified addresses createdAt status updatedAt avatar')
      .sort({ createdAt: -1 })
    res.json(customers)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await User.findById(req.params.id).select(
      'username email fullName phone role isVerified addresses createdAt status updatedAt avatar'
    )
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' })
      return
    }
    res.json(customer)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedCustomer = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    }).select('-passwordHash')
    if (!updatedCustomer) {
      res.status(404).json({ message: 'Customer not found' })
      return
    }
    res.json(updatedCustomer)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'Customer deleted' })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

/* -------------------------------- Users ---------------------------------- */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query
    const query: any = {}

    // Filter by role if specified
    if (role && role !== 'all') {
      query.role = role
    }

    // Search by username, email or fullName
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (Number(page) - 1) * Number(limit)

    const [users, total] = await Promise.all([
      User.find(query)
        .select('username email fullName phone role isVerified addresses createdAt status updatedAt avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query)
    ])

    res.json({
      data: users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
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

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select(
      'username email fullName phone role isVerified addresses createdAt status updatedAt avatar'
    )
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

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, fullName, phone, role, status, avatar, addresses, isVerified } = req.body

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
      status: status || 'active',
      avatar,
      addresses: addresses || [],
      isVerified: isVerified !== undefined ? isVerified : true // Manager created users are pre-verified by default
    })

    const savedUser = await user.save()
    // Audit log
    await logAdminAction(req, {
      adminId: req.user?._id,
      action: 'CREATE_USER',
      target: savedUser && savedUser._id ? String(savedUser._id) : '',
      detail: `Created user: ${savedUser.username}`
    })

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
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Prevent updating sensitive fields
    delete updateData.passwordHash
    delete updateData.email

    // If password is provided, hash it
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10)
      updateData.passwordHash = await bcrypt.hash(updateData.password, salt)
      delete updateData.password
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-passwordHash')
    // Audit log
    await logAdminAction(req, {
      adminId: req.user?._id,
      action: 'UPDATE_USER',
      target: id,
      detail: `Updated user: ${user?.username || id}`
    })

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
}

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status, reason } = req.body
    if (!['active', 'locked'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }
    if (status === 'locked' && (!reason || reason.trim() === '')) {
      return res.status(400).json({ message: 'Ban reason is required' })
    }
    const user = await User.findByIdAndUpdate(
      id,
      { status, banReason: status === 'locked' ? reason : '' },
      { new: true }
    ).select('-passwordHash')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    await logAdminAction(req, {
      adminId: req.user?._id,
      action: status === 'locked' ? 'LOCK_USER' : 'UNLOCK_USER',
      target: id,
      detail: `Set user status to ${status}${reason ? `, reason: ${reason}` : ''}`
    })
    // Gửi email thông báo
    await sendBanUserEmail(user.email, reason || '', req.user?.username || 'admin', status)
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
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
    // Audit log
    await logAdminAction(req, {
      adminId: req.user?._id,
      action: 'DELETE_USER',
      target: id,
      detail: `Deleted user: ${user?.username || id}`
    })

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
}

/* -------------------------------- Settings -------------------------------- */
export const getSettings = async (_req: Request, res: Response) => {
  try {
    res.json({
      siteName: 'ApexCV',
      contactEmail: 'contact@apexcv.com',
      supportPhone: '+1234567890'
    })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const updateSettings = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Settings updated', settings: req.body })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

/* --------------------------------- Stats ---------------------------------- */
export const getSalesStats = async (_req: Request, res: Response) => {
  try {
    res.json({ message: 'Sales statistics' })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const getUserStats = async (_req: Request, res: Response) => {
  try {
    res.json({ message: 'User statistics' })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const getOrderStats = async (_req: Request, res: Response) => {
  try {
    res.json({ message: 'Order statistics' })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const getCustomerStats = async (_req: Request, res: Response) => {
  try {
    res.json({ message: 'Customer statistics' })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const getBrands = async (_req: Request, res: Response) => {
  try {
    const brands = await Brand.find().lean()
    res.json(brands)
  } catch (error: unknown) {
    res.status(500).json({ message: 'Error fetching brands', error: error instanceof Error ? error.message : 'Unknown error' })
  }
}
