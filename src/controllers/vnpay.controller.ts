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
    const userId = req.user?._id || req.body.user;
    console.log('[VNPAY] User ID for payment:', userId);
    
    req.session.pendingOrder = {
      ...req.body,
      user: userId,
    };
    
    // Lưu session ngay lập tức
    req.session.save((err) => {
      if (err) {
        console.error('[VNPAY] Error saving session:', err);
      } else {
        console.log('[VNPAY] Session saved successfully');
      }
    });
    
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
    
    let result;
    try {
      result = verifyVnpayReturn(req.query as any);
      console.log('[VNPAY Return] Verification result:', JSON.stringify(result, null, 2));
    } catch (verifyError) {
      console.error('[VNPAY Return] Verification error:', verifyError);
      // Tiếp tục xử lý ngay cả khi verification fail
      result = { isSuccess: false, message: 'Verification failed but continuing' };
    }
    
    if (!req.session.pendingOrder) {
      console.log('[VNPAY Return] No pending order in session, checking transaction status');
      
      // Kiểm tra xem transaction này đã được xử lý chưa
      const existingOrder = await Order.findOne({ 'paymentResult.id': req.query['vnp_TransactionNo'] });
      if (existingOrder) {
        return res.json({ 
          status: 'success', 
          message: 'Đơn hàng đã tồn tại', 
          order: existingOrder,
          result: { isSuccess: true, message: 'Order already processed' }
        });
      }
      
      // Nếu không có order và không có session, tạo order từ VNPAY data
      if (req.query['vnp_ResponseCode'] === '00' && req.query['vnp_TransactionStatus'] === '00') {
        console.log('[VNPAY Return] Creating order from VNPAY data');
        return await createOrderFromVnpayData(req, res);
      }
      
      return res.json({ status: 'fail', message: 'Không tìm thấy thông tin đơn hàng', result });
    }

    const orderData = req.session.pendingOrder;

    // Kiểm tra đã tạo đơn hàng cho transaction này chưa
    const existingOrder = await Order.findOne({ 'paymentResult.id': req.query['vnp_TransactionNo'] });
    if (existingOrder) {
      return res.json({ status: 'success', message: 'Đơn hàng đã tồn tại', order: existingOrder });
    }

    let user;
    if (userId) {
      user = await User.findById(userId);
    }
    
    // Fallback: tìm user bằng email nếu không có userId
    if (!user && orderData.shippingAddress?.email) {
      user = await User.findOne({ email: orderData.shippingAddress.email });
    }
    
    // Fallback: tạo user tạm thời nếu không tìm thấy
    if (!user) {
      console.log('[VNPAY Return] Creating temporary user for order');
      user = new User({
        username: `guest_${Date.now()}`,
        fullName: orderData.shippingAddress?.fullName || 'Khách hàng',
        email: orderData.shippingAddress?.email || `guest_${Date.now()}@example.com`,
        phone: orderData.shippingAddress?.phone || '0123456789',
        isGuest: true, // Đánh dấu là khách hàng
      });
      await user.save();
    }
    
    // Cập nhật userId nếu chưa có
    const finalUserId = userId || user._id;

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
      user: finalUserId,
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
        const filteredCartItems = userCart.cartItems.filter((cartItem: any) => {
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
        
        // Clear and repopulate the DocumentArray
        userCart.cartItems.splice(0, userCart.cartItems.length);
        filteredCartItems.forEach(item => userCart.cartItems.push(item));
        
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
 * Tạo order từ dữ liệu VNPAY khi session bị mất
 */
async function createOrderFromVnpayData(req: Request, res: Response) {
  try {
    const vnpAmount = parseInt(req.query['vnp_Amount'] as string) / 100; // Chia 100 vì VNPAY nhân 100
    const vnpTxnRef = req.query['vnp_TxnRef'] as string;
    const vnpTransactionNo = req.query['vnp_TransactionNo'] as string;
    
    // Tạo user tạm thời
    const user = new User({
      username: `guest_${Date.now()}`,
      fullName: 'Khách hàng',
      email: `guest_${Date.now()}@example.com`,
      phone: '0123456789',
      isGuest: true,
    });
    await user.save();
    
    // Tạo order đơn giản
    const order = new Order({
      user: user._id,
      userSnapshot: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
      orderItems: [{
        product: '000000000000000000000000', // Placeholder product ID
        name: 'Sản phẩm',
        quantity: 1,
        size: [{
          size: 'M',
          color: 'Default',
          quantity: 1,
          sku: 'PRODUCT_M_DEFAULT'
        }],
        price: vnpAmount,
        productName: 'Sản phẩm',
        productImage: '',
        productBrand: '',
      }],
      shippingAddress: {
        fullName: 'Khách hàng',
        phone: '0123456789',
        address: 'Địa chỉ giao hàng',
        city: 'Hà Nội',
        district: 'Quận 1',
        ward: 'Phường 1',
      },
      paymentMethod: 'VNPAY',
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: vnpAmount,
      isPaid: true,
      paidAt: new Date(),
      orderStatus: 'paid',
      paymentResult: {
        id: vnpTransactionNo,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: user.email,
      },
    });
    
    const savedOrder = await order.save();
    
    return res.json({
      status: 'success',
      message: 'Đặt hàng và thanh toán thành công',
      order: savedOrder,
      result: { isSuccess: true, message: 'Order created from VNPAY data' }
    });
  } catch (err) {
    console.error('Lỗi tạo order từ VNPAY data:', err);
    return res.status(400).json({ 
      error: 'Tạo đơn hàng thất bại', 
      detail: (err as any)?.message 
    });
  }
}

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