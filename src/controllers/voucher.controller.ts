import { Request, Response } from 'express'
import { Voucher } from '../models/Voucher'
import { Order } from '../models/Order'

export const applyVoucher = async (req: Request, res: Response) => {
  try {
    const { voucherCode, productId, price, quantity } = req.body
    if (!voucherCode || !productId || typeof price !== 'number' || typeof quantity !== 'number') {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin đầu vào' })
    }

    // Tìm voucher
    const voucher = await Voucher.findOne({ code: voucherCode })
    if (!voucher) {
      return res.status(400).json({ success: false, message: 'Voucher không hợp lệ hoặc đã hết hạn' })
    }
    // Kiểm tra hạn sử dụng
    if (voucher.expiry < new Date()) {
      return res.status(400).json({ success: false, message: 'Voucher không hợp lệ hoặc đã hết hạn' })
    }

    let discountAmount = 0
    let newPrice = price
    let message = 'Áp dụng thành công!'

    if (voucherCode === 'SALE10') {
      if (price * quantity >= 500000) {
        discountAmount = Math.round(price * 0.1)
        newPrice = price - discountAmount
      } else {
        return res.status(400).json({ success: false, message: 'Đơn hàng chưa đủ điều kiện áp dụng SALE10' })
      }
    } else if (voucherCode === 'WELCOME20') {
      // Kiểm tra user đã từng đặt đơn chưa
      if (!req.user || !req.user._id) {
        return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để sử dụng mã này' })
      }
      const orderCount = await Order.countDocuments({ user: req.user._id })
      if (orderCount === 0) {
        discountAmount = Math.round(price * 0.2)
        newPrice = price - discountAmount
      } else {
        return res.status(400).json({ success: false, message: 'Chỉ áp dụng cho khách hàng mới (chưa từng đặt đơn)' })
      }
    } else if (voucherCode === 'FREESHIP') {
      discountAmount = 0
      newPrice = price
      message = 'Áp dụng mã freeship thành công!'
      return res.json({
        success: true,
        discountAmount,
        newPrice,
        message,
        freeShipping: true
      })
    } else {
      return res.status(400).json({ success: false, message: 'Voucher không hợp lệ hoặc đã hết hạn' })
    }

    return res.json({
      success: true,
      discountAmount,
      newPrice,
      message
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi server' })
  }
}

export const getAllVouchers = async (req: Request, res: Response) => {
  try {
    const vouchers = await Voucher.find().sort({ expiry: 1 });
    res.json({ success: true, data: vouchers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
}; 