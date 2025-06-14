// Đây là phần CRUD mở rộng cho các router quản trị

import express from 'express'
import type { Request, Response, NextFunction } from 'express'
import {
  getDashboard,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getSettings,
  updateSettings,
  getSalesStats,
  getUserStats,
  getOrderStats,
  getCustomerStats,
  getBrands
} from '../../controllers/managerController'
import { authenticateToken, isManager } from '../../middlewares/auth'

const router = express.Router()

// Đảm bảo middleware có đúng chữ ký (req, res, next)
const secureRoute = [
  authenticateToken as (req: Request, res: Response, next: NextFunction) => void,
  isManager as (req: Request, res: Response, next: NextFunction) => void
]
router.use(...secureRoute)

router.get('/dashboard', getDashboard)

// Products CRUD
router.get('/products', getProducts)
router.get('/products/:id', (req, res, next) => {
  Promise.resolve(getProductById(req, res)).catch(next)
})
router.post('/products', createProduct)
router.put('/products/:id', updateProduct)
router.delete('/products/:id', deleteProduct)

// Categories CRUD
router.get('/categories', getCategories)
router.get('/categories/:id', (req, res, next) => {
  Promise.resolve(getCategoryById(req, res)).catch(next)
})
router.post('/categories', createCategory)
router.put('/categories/:id', (req, res, next) => {
  Promise.resolve(updateCategory(req, res)).catch(next)
})
router.delete('/categories/:id', deleteCategory)

// Orders CRUD (chủ yếu update trạng thái)
router.get('/orders', getOrders)
router.get('/orders/:id', (req, res, next) => {
  Promise.resolve(getOrderById(req, res)).catch(next)
})
router.put('/orders/:id', updateOrderStatus)
router.delete('/orders/:id', deleteOrder)

// Customers CRUD
router.get('/customers', getCustomers)
router.get('/customers/:id', (req, res, next) => {
  Promise.resolve(getCustomerById(req, res)).catch(next)
})
router.put('/customers/:id', updateCustomer)
router.delete('/customers/:id', deleteCustomer)

// Settings
router.get('/settings', getSettings)
router.put('/settings', updateSettings)

// Stats
router.get('/stats/sales', getSalesStats)
router.get('/stats/users', getUserStats)
router.get('/stats/orders', getOrderStats)
router.get('/stats/customers', getCustomerStats)

//Brands
router.get('/brands', getBrands)

export default router
