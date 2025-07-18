import express from 'express';
import { Coupon } from '../models/Coupon';

const router = express.Router();

// POST /apply-coupon: kiểm tra mã hợp lệ cho đơn hàng
router.post('/', async (req, res) => {
  try {
    const { code, orderValue } = req.body;
    if (!code || typeof orderValue !== 'number') {
      return res.status(400).json({ success: false, message: 'Missing code or order value' });
    }
    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });

    // Tự động cập nhật isActive nếu hết hạn hoặc dùng hết
    const now = new Date();
    if (coupon.expiresAt < now || coupon.used >= coupon.maxUsage) {
      if (coupon.isActive) {
        coupon.isActive = false;
        await coupon.save();
      }
      return res.status(400).json({ success: false, message: 'Coupon expired or max usage reached' });
    }
    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: 'Coupon is not active' });
    }
    if (orderValue < coupon.minOrderValue) {
      return res.status(400).json({ success: false, message: 'Order value too low for this coupon' });
    }
    // Hợp lệ
    res.json({ success: true, data: coupon });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router; 