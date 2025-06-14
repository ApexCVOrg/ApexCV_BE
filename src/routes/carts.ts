import express, { Request, Response, Router } from 'express'
import { Cart } from '../models/Cart'

const router: Router = express.Router()

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const carts = await Cart.find().populate('user cartItems.product')
    res.json(carts)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách giỏ hàng: ' + (error as Error).message })
  }
})

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findById(req.params.id).populate('user cartItems.product')
    if (!cart) {
      res.status(404).json({ message: 'Không tìm thấy giỏ hàng' })
      return
    }
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin giỏ hàng: ' + (error as Error).message })
  }
})

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const cart = new Cart(req.body)
    const savedCart = await cart.save()
    res.status(201).json(savedCart)
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi tạo giỏ hàng: ' + (error as Error).message })
  }
})

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!cart) {
      res.status(404).json({ message: 'Không tìm thấy giỏ hàng' })
      return
    }
    res.json(cart)
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi cập nhật giỏ hàng: ' + (error as Error).message })
  }
})

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id)
    if (!cart) {
      res.status(404).json({ message: 'Không tìm thấy giỏ hàng' })
      return
    }
    res.json({ message: 'Đã xóa giỏ hàng thành công' })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa giỏ hàng: ' + (error as Error).message })
  }
})

export default router
