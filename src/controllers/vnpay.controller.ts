import { Request, Response } from 'express';
import { createVnpayPayment, verifyVnpayReturn, verifyVnpayIpn } from '../services/vnpay.service';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Cart } from '../models/Cart';
import jwt from 'jsonwebtoken';

/**
 * API tạo link thanh toán VNPAY
 */
export const createPayment = (req: Request, res: Response) => {
  try {
    console.log('[VNPAY] Bắt đầu tạo payment URL');
    console.log('[VNPAY] Request body:', JSON.stringify(req.body, null, 2));
    console.log('[VNPAY] User from request:', req.user);
    
    // Đảm bảo luôn có userId trong pendingOrder
    req.session.pendingOrder = {
      ...req.body,
      user: req.user?._id || req.body.user,
    };
    
    console.log('[VNPAY] Pending order data:', JSON.stringify(req.session.pendingOrder, null, 2));
    
    const url = createVnpayPayment(req.body);
    console.log('[VNPAY] Generated payment URL:', url);
    
    res.json({ paymentUrl: url });
  } catch (err) {
    console.error('[VNPAY] Error creating payment URL:', err);
    console.error('[VNPAY] Error details:', (err as any)?.message);
    res.status(400).json({ error: 'Tạo link thanh toán thất bại', detail: (err as any)?.message });
  }
};


/**
 * API xử lý returnUrl từ VNPAY
 */
export const handleReturnUrl = async (req: Request, res: Response) => {
  try {
    console.log('[VNPAY Return] Bắt đầu xử lý returnUrl');
    console.log('[VNPAY Return] Query params:', JSON.stringify(req.query, null, 2));
    console.log('[VNPAY Return] Headers:', JSON.stringify(req.headers, null, 2));
    
    // Lấy userId từ session hoặc từ token
    let userId = req.session.pendingOrder?.user;
    if (!userId) {
      // Nếu không có userId trong session, lấy từ token
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
          userId = decoded.userId || decoded.id;
        } catch (err) {
          return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
        }
      }
    }
    console.log('[VNPAY Return] pendingOrder:', req.session.pendingOrder);
    console.log('[VNPAY Return] userId:', userId);
    
    const result = verifyVnpayReturn(req.query as any);
    console.log('[VNPAY Return] Verification result:', JSON.stringify(result, null, 2));
    
    if (!result.isSuccess || !req.session.pendingOrder) {
      console.log('[VNPAY Return] Verification failed or no pending order');
      return res.json({ status: 'fail', message: result.message, result });
    }

    const orderData = req.session.pendingOrder;

    // Kiểm tra đã tạo đơn hàng cho transaction này chưa
    const existingOrder = await Order.findOne({ 'paymentResult.id': req.query['vnp_TransactionNo'] });
    if (existingOrder) {
      return res.json({ status: 'success', message: 'Đơn hàng đã tồn tại', order: existingOrder });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'Không tìm thấy người dùng để tạo đơn hàng' });
    }

    // Tạo snapshot cho mỗi order item
    const populatedOrderItems = await Promise.all(
      orderData.orderItems.map(async (item: any) => {
        const product = await Product.findById(item.product).populate('brand');
        
        // Tạo sku từ size và color nếu không có
        const sizeWithSku = item.size.map((sizeItem: any) => ({
          ...sizeItem,
          sku: sizeItem.sku || `${product?.name || 'product'}_${sizeItem.size}_${sizeItem.color || 'default'}`.replace(/\s+/g, '_').toUpperCase()
        }));
        
        return {
          ...item,
          size: sizeWithSku,
          productName: product?.name || '',
          productImage: product?.images?.[0] || '',
          productBrand: (product?.brand as any)?.name || '',
        };
      })
    );

    // Tạo đơn hàng mới
    const order = new Order({
      user: userId,
      userSnapshot: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
      orderItems: populatedOrderItems,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      taxPrice: orderData.taxPrice || 0,
      shippingPrice: orderData.shippingPrice || 0,
      totalPrice: orderData.totalPrice,
      isPaid: true,
      paidAt: new Date(),
      orderStatus: 'paid',
      paymentResult: {
        id: req.query['vnp_TransactionNo'],
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: user.email,
      },
    });

    const savedOrder = await order.save();

    // Xóa sản phẩm khỏi giỏ hàng sau khi thanh toán thành công
    try {
      const userCart = await Cart.findOne({ user: userId });
      if (userCart) {
        // Lấy danh sách product IDs đã thanh toán
        const paidProductIds = orderData.orderItems.map((item: any) => item.product);
        
        // Xóa các cart items tương ứng
        userCart.cartItems = userCart.cartItems.filter((cartItem: any) => {
          // Kiểm tra xem cart item có phải là sản phẩm đã thanh toán không
          const isPaidProduct = paidProductIds.includes(cartItem.product.toString());
          
          // Nếu là sản phẩm đã thanh toán, kiểm tra size và color có khớp không
          if (isPaidProduct) {
            const paidItem = orderData.orderItems.find((item: any) => 
              item.product === cartItem.product.toString()
            );
            
            if (paidItem) {
              const paidSize = paidItem.size[0];
              return !(cartItem.size === paidSize.size && cartItem.color === paidSize.color);
            }
          }
          
          return true; // Giữ lại nếu không phải sản phẩm đã thanh toán
        });
        
        await userCart.save();
        console.log('[VNPAY Return] Đã xóa sản phẩm khỏi giỏ hàng');
      }
    } catch (cartError) {
      console.error('[VNPAY Return] Lỗi khi xóa giỏ hàng:', cartError);
      // Không throw error vì order đã tạo thành công
    }

    // Xoá session pendingOrder
    delete req.session.pendingOrder;

    res.json({
      status: 'success',
      message: 'Đặt hàng và thanh toán thành công',
      order: savedOrder,
    });
  } catch (err) {
    console.error('Lỗi xử lý returnUrl:', err);
    res.status(400).json({ error: 'Xác thực returnUrl thất bại', detail: (err as any)?.message });
  }
};

/**
 * API xử lý IPN từ VNPAY
 */
export const handleIpn = (req: Request, res: Response) => {
  try {
    const result = verifyVnpayIpn(req.query as any);
    // TODO: Cập nhật trạng thái đơn hàng ở đây nếu cần
    res.json({ status: result.isSuccess ? 'success' : 'fail', result });
  } catch (err) {
    res.status(400).json({ error: 'Xác thực IPN thất bại', detail: (err as any)?.message });
  }
}; 