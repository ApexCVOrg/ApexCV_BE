import { Request, Response } from 'express'
import { Coupon } from '../models/Coupon'

export const applyCoupon = async (req: Request, res: Response) => {
  try {
    const { couponCode, productId, price, quantity, isNewCustomer } = req.body
    console.log('Received request:', { couponCode, productId, price, quantity, isNewCustomer })
    console.log('Request body:', req.body)

    // Validation chi tiết
    const errors = []

    if (!couponCode) {
      errors.push('Mã coupon không được để trống')
    }

    if (!productId) {
      errors.push('ID sản phẩm không được để trống')
    }

    // Chuyển đổi price và quantity thành number
    const numericPrice = Number(price)
    const numericQuantity = Number(quantity)

    if (isNaN(numericPrice) || numericPrice <= 0) {
      errors.push('Giá sản phẩm không hợp lệ')
    }

    if (isNaN(numericQuantity) || numericQuantity <= 0) {
      errors.push('Số lượng sản phẩm không hợp lệ')
    }

    if (errors.length > 0) {
      console.log('Validation errors:', errors)
      return res.status(400).json({
        success: false,
        message: errors.join('. '),
        errors: errors
      })
    }

    // Tìm coupon
    console.log('Searching for coupon with code:', couponCode)
    const coupon = await Coupon.findOne({ code: couponCode, isActive: true })
    console.log('Found coupon:', coupon)

    if (!coupon) {
      // Kiểm tra xem có coupon nào trong database không
      const allCoupons = await Coupon.find({})
      console.log(
        'All coupons in database:',
        allCoupons.map((c) => ({ code: c.code, isActive: c.isActive }))
      )
      return res.status(400).json({
        success: false,
        message: `Mã coupon "${couponCode}" không tồn tại hoặc đã bị vô hiệu hóa`,
        errorType: 'COUPON_NOT_FOUND'
      })
    }

    // Kiểm tra hạn sử dụng
    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: `Coupon "${couponCode}" đã hết hạn vào ${coupon.expiresAt.toLocaleDateString('vi-VN')}`,
        errorType: 'COUPON_EXPIRED'
      })
    }

    // Kiểm tra số lần sử dụng
    if (coupon.used >= coupon.maxUsage) {
      return res.status(400).json({
        success: false,
        message: `Coupon "${couponCode}" đã hết lượt sử dụng (${coupon.used}/${coupon.maxUsage})`,
        errorType: 'COUPON_USAGE_LIMIT'
      })
    }

    // Kiểm tra giá trị đơn hàng tối thiểu
    const orderValue = numericPrice * numericQuantity
    console.log('Order validation:', {
      orderValue,
      minOrderValue: coupon.minOrderValue,
      price: numericPrice,
      quantity: numericQuantity,
      isValid: orderValue >= coupon.minOrderValue
    })

    if (orderValue < coupon.minOrderValue) {
      const remaining = coupon.minOrderValue - orderValue
      return res.status(400).json({
        success: false,
        message: `Đơn hàng chưa đủ điều kiện áp dụng coupon "${couponCode}". Cần thêm ${remaining.toLocaleString()}đ nữa (tối thiểu ${coupon.minOrderValue.toLocaleString()}đ)`,
        errorType: 'MIN_ORDER_VALUE',
        currentValue: orderValue,
        requiredValue: coupon.minOrderValue,
        remaining: remaining
      })
    }

    let discountAmount = 0
    let newPrice = numericPrice
    let message = 'Áp dụng thành công!'

    // Tính toán giảm giá
    if (coupon.type === 'percentage') {
      discountAmount = Math.round(numericPrice * (coupon.value / 100))
      newPrice = numericPrice - discountAmount
      message = `Giảm ${coupon.value}% - Tiết kiệm ${discountAmount.toLocaleString()}đ`
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.value
      newPrice = numericPrice - discountAmount
      if (newPrice < 0) newPrice = 0
      message = `Giảm ${discountAmount.toLocaleString()}đ`
    }

    return res.json({
      success: true,
      discountAmount,
      newPrice,
      message,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        remainingUsage: coupon.maxUsage - coupon.used
      }
    })
  } catch {
    console.error('Error in applyCoupon')
    return res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.',
      errorType: 'SERVER_ERROR'
    })
  }
}

export const getAllCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find({ isActive: true }).sort({ expiresAt: 1 })
    res.json({ success: true, data: coupons })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' })
  }
}
