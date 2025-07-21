import express from 'express'
import { Coupon } from '../../models/Coupon'

const router = express.Router()

// POST /admin/coupons: tạo mã mới
router.post('/', async (req, res) => {
  try {
    const coupon = new Coupon(req.body)
    await coupon.save()
    res.status(201).json({ success: true, data: coupon })
  } catch (err: unknown) {
    res.status(400).json({ success: false, message: err instanceof Error ? err.message : 'Unknown error' })
  }
})

// GET /admin/coupons: lấy danh sách mã (phân trang, lọc theo trạng thái)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive } = req.query
    const filter: { isActive?: boolean } = {}
    if (isActive !== undefined) filter.isActive = isActive === 'true'
    const total = await Coupon.countDocuments(filter)
    const coupons = await Coupon.find(filter)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit)
    res.json({ success: true, data: coupons, total })
  } catch (err: unknown) {
    res.status(500).json({ success: false, message: err instanceof Error ? err.message : 'Unknown error' })
  }
})

// PATCH /admin/coupons/:id: cập nhật mã
router.patch('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' })
    res.json({ success: true, data: coupon })
  } catch (err: unknown) {
    res.status(400).json({ success: false, message: err instanceof Error ? err.message : 'Unknown error' })
  }
})

// DELETE /admin/coupons/:id: xoá mã
router.delete('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id)
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' })
    res.json({ success: true, message: 'Deleted' })
  } catch (err: unknown) {
    res.status(400).json({ success: false, message: err instanceof Error ? err.message : 'Unknown error' })
  }
})

export default router
