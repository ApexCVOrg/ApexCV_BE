import { Request, Response, NextFunction } from 'express'

/**
 * Middleware kiểm tra size và màu cho order items
 */
export const validateOrderItems = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderItems } = req.body

    if (!orderItems || !Array.isArray(orderItems)) {
      return res.status(400).json({
        error: 'Order items are required',
        detail: 'Please provide order items array'
      })
    }

    // Kiểm tra từng item có size và màu đầy đủ không
    const invalidItems = orderItems.filter((item: any) => {
      // Kiểm tra item có size array không
      if (!item.size || !Array.isArray(item.size) || item.size.length === 0) {
        return true
      }

      // Kiểm tra từng size item có size và color không
      return item.size.some((sizeItem: any) => {
        return !sizeItem.size || !sizeItem.color
      })
    })

    if (invalidItems.length > 0) {
      console.error('[Order Validation] Items missing size or color:', invalidItems)
      return res.status(400).json({
        error: 'Size and color are required for all items',
        detail: 'Please select size and color for all products before checkout',
        invalidItems: invalidItems.map((item: any) => ({
          product: item.product,
          name: item.name
        }))
      })
    }

    // Kiểm tra thêm: size và color không được rỗng
    const emptySizeColorItems = orderItems.filter((item: any) => {
      return item.size.some((sizeItem: any) => {
        return !sizeItem.size.trim() || !sizeItem.color.trim()
      })
    })

    if (emptySizeColorItems.length > 0) {
      console.error('[Order Validation] Items with empty size or color:', emptySizeColorItems)
      return res.status(400).json({
        error: 'Size and color cannot be empty',
        detail: 'Please provide valid size and color values',
        invalidItems: emptySizeColorItems.map((item: any) => ({
          product: item.product,
          name: item.name
        }))
      })
    }

    next()
  } catch (error) {
    console.error('[Order Validation] Error:', error)
    return res.status(500).json({
      error: 'Validation error',
      detail: 'Internal server error during validation'
    })
  }
}

/**
 * Middleware kiểm tra thông tin shipping address
 */
export const validateShippingAddress = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shippingAddress } = req.body

    if (!shippingAddress) {
      return res.status(400).json({
        error: 'Shipping address is required',
        detail: 'Please provide shipping address'
      })
    }

    const requiredFields = ['fullName', 'phone', 'street', 'city', 'state', 'postalCode', 'country']
    const missingFields = requiredFields.filter((field) => !shippingAddress[field])

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Shipping address is incomplete',
        detail: `Missing fields: ${missingFields.join(', ')}`,
        missingFields
      })
    }

    next()
  } catch (error) {
    console.error('[Address Validation] Error:', error)
    return res.status(500).json({
      error: 'Validation error',
      detail: 'Internal server error during validation'
    })
  }
}
