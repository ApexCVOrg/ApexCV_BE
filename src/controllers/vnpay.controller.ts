import { Request, Response } from 'express';
import { createVnpayPayment, verifyVnpayReturn, verifyVnpayIpn } from '../services/vnpay.service';
import { Order, PendingOrder } from '../models/Order';
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
    console.log('[VNPAY] User ID from body:', req.body.user);
    
    // Đảm bảo luôn có userId trong pendingOrder
    const userId = req.user?._id || req.body.user;
    console.log('[VNPAY] Final User ID for payment:', userId);
    
    if (!userId) {
      console.error('[VNPAY] No user ID found');
      return res.status(400).json({ 
        error: 'User ID is required for payment',
        detail: 'Please ensure user is authenticated'
      });
    }
    
    // Kiểm tra orderItems có size và màu đầy đủ không
    if (req.body.orderItems && Array.isArray(req.body.orderItems)) {
      const invalidItems = req.body.orderItems.filter((item: any) => {
        if (!item.size || !Array.isArray(item.size) || item.size.length === 0) {
          return true;
        }
        const sizeItem = item.size[0];
        return !sizeItem.size || !sizeItem.color;
      });
      
      if (invalidItems.length > 0) {
        console.error('[VNPAY] Items missing size or color:', invalidItems);
        return res.status(400).json({
          error: 'Size and color are required for all items',
          detail: 'Please select size and color for all products before checkout'
        });
      }
    }
    
    // Tạo session ID duy nhất cho order này
    const sessionId = `payment_${Date.now()}_${userId}`;
    
    // Lưu thông tin order vào session với user ID
    req.session.pendingOrder = {
      ...req.body,
      user: userId,
      sessionId: sessionId,
      createdAt: new Date().toISOString(),
    };
    
    console.log('[VNPAY] Pending order data:', JSON.stringify(req.session.pendingOrder, null, 2));
    
    // Lưu session ngay lập tức và đợi hoàn thành
    req.session.save(async (err) => {
      if (err) {
        console.error('[VNPAY] Error saving session:', err);
        return res.status(500).json({ 
          error: 'Failed to save session',
          detail: 'Please try again'
        });
      }
      
        console.log('[VNPAY] Session saved successfully');
      
      // Lưu backup vào database
      try {
        const pendingOrder = new PendingOrder({
          sessionId: sessionId,
          userId: userId,
          orderData: req.session.pendingOrder
        });
        await pendingOrder.save();
        console.log('[VNPAY] Backup order data saved to database');
      } catch (backupError) {
        console.error('[VNPAY] Error saving backup order data:', backupError);
        // Không return error vì session đã lưu thành công
      }
      
      // Tạo URL thanh toán sau khi session đã được lưu
      try {
        const url = createVnpayPayment(req.body);
        console.log('[VNPAY] Generated payment URL:', url);
        res.json({ paymentUrl: url });
      } catch (paymentError) {
        console.error('[VNPAY] Error creating payment URL:', paymentError);
        res.status(400).json({ 
          error: 'Tạo link thanh toán thất bại', 
          detail: (paymentError as any)?.message 
        });
      }
    });
    
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
    let orderData = req.session.pendingOrder;
    
    if (!userId) {
      // Nếu không có userId trong session, lấy từ token
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
          userId = decoded.userId || decoded.id;
          console.log('[VNPAY Return] Got userId from token:', userId);
        } catch (err) {
          console.log('[VNPAY Return] Token verification failed:', err);
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
      
      // Kiểm tra xem transaction này đã được xử lý chưa
      const existingOrder = await Order.findOne({ 'paymentResult.id': req.query['vnp_TransactionNo'] });
      if (existingOrder) {
      console.log('[VNPAY Return] Order already exists:', existingOrder._id);
        return res.json({ 
          status: 'success', 
          message: 'Đơn hàng đã tồn tại', 
          order: existingOrder,
          result: { isSuccess: true, message: 'Order already processed' }
        });
      }
      
    // Nếu không có session, thử lấy từ backup database
    if (!req.session.pendingOrder && userId) {
      console.log('[VNPAY Return] No session found, trying to get from backup database');
      try {
        const backupOrder = await PendingOrder.findOne({ userId: userId }).sort({ createdAt: -1 });
        if (backupOrder) {
          console.log('[VNPAY Return] Found backup order data');
          orderData = backupOrder.orderData;
          // Xóa backup data sau khi sử dụng
          await PendingOrder.findByIdAndDelete(backupOrder._id);
        }
      } catch (backupError) {
        console.error('[VNPAY Return] Error getting backup order data:', backupError);
      }
    }
    
    // Nếu không có session và không có token user, không thể tạo order
    if (!orderData && !userId) {
      console.log('[VNPAY Return] No session and no user token found');
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Không tìm thấy thông tin đơn hàng và người dùng. Vui lòng thực hiện lại quá trình thanh toán.',
        result: { isSuccess: false, message: 'Session and user information required' }
      });
    }
    
    // Nếu có session nhưng không có user, không thể tạo order
    if (req.session.pendingOrder && !userId) {
      console.log('[VNPAY Return] Session exists but no user found');
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.',
        result: { isSuccess: false, message: 'User information required' }
      });
    }

    // Tìm user thực từ userId
    let user;
    if (userId) {
      user = await User.findById(userId);
      console.log('[VNPAY Return] Found user:', user ? user.email : 'not found');
    }
    
    // Nếu không tìm thấy user, không thể tạo order
    if (!user) {
      console.log('[VNPAY Return] User not found, cannot create order');
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.' 
      });
    }
    
    // Nếu không có orderData từ session hoặc backup, không thể tạo order
    if (!orderData) {
      console.log('[VNPAY Return] No order data from session or backup, cannot create order');
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Không tìm thấy thông tin đơn hàng. Vui lòng thực hiện lại quá trình thanh toán.',
        result: { isSuccess: false, message: 'Order data required' }
      });
    }
    
    // Sử dụng userId thực
    const finalUserId = user._id;

    console.log('[VNPAY Return] Processing order with items:', orderData.orderItems.length);
    console.log('[VNPAY Return] Order items details:', JSON.stringify(orderData.orderItems, null, 2));

    // Tạo snapshot cho mỗi order item
    const populatedOrderItems = await Promise.all(
      orderData.orderItems.map(async (item: any, index: number) => {
        console.log(`[VNPAY Return] Processing item ${index + 1}:`, item.product, item.name);
        
        const product = await Product.findById(item.product).populate('brand');
        console.log(`[VNPAY Return] Found product for item ${index + 1}:`, product ? product.name : 'not found');
        
        // Tạo sku từ size và color nếu không có
        const sizeWithSku = item.size.map((sizeItem: any) => ({
          ...sizeItem,
          sku: sizeItem.sku || `${product?.name || 'product'}_${sizeItem.size}_${sizeItem.color || 'default'}`.replace(/\s+/g, '_').toUpperCase()
        }));
        
        const populatedItem = {
          ...item,
          size: sizeWithSku,
          productName: product?.name || '',
          productImage: product?.images?.[0] || '',
          productBrand: (product?.brand as any)?.name || '',
        };
        
        console.log(`[VNPAY Return] Populated item ${index + 1}:`, {
          productName: populatedItem.productName,
          quantity: populatedItem.quantity,
          size: populatedItem.size[0].size,
          color: populatedItem.size[0].color,
          price: populatedItem.price
        });
        
        return populatedItem;
      })
    );

    console.log('[VNPAY Return] All items populated successfully, creating order...');

    // Tạo đơn hàng mới với thông tin user thực
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
    console.log('[VNPAY Return] Order created successfully:', savedOrder._id);
    console.log('[VNPAY Return] Order contains items:', savedOrder.orderItems.length);
    console.log('[VNPAY Return] Order total price:', savedOrder.totalPrice);
    console.log('[VNPAY Return] Order items summary:', savedOrder.orderItems.map((item: any, index: number) => ({
      index: index + 1,
      productName: item.productName,
      quantity: item.quantity,
      size: item.size[0].size,
      color: item.size[0].color,
      price: item.price
    })));

    // Xóa sản phẩm khỏi giỏ hàng sau khi thanh toán thành công
    try {
      const userCart = await Cart.findOne({ user: userId });
      if (userCart) {
        console.log('[VNPAY Return] Processing cart cleanup for multiple items');
        
        // Tạo map để track các items đã thanh toán
        const paidItemsMap = new Map();
        orderData.orderItems.forEach((item: any) => {
          const key = `${item.product}_${item.size[0].size}_${item.size[0].color}`;
          paidItemsMap.set(key, item.size[0].quantity);
        });
        
        console.log('[VNPAY Return] Paid items map:', Array.from(paidItemsMap.entries()));
        
        // Lọc cart items để xóa những items đã thanh toán
        const filteredCartItems = userCart.cartItems.filter((cartItem: any) => {
          const cartKey = `${cartItem.product}_${cartItem.size}_${cartItem.color}`;
          const paidQuantity = paidItemsMap.get(cartKey);
          
          if (paidQuantity !== undefined) {
            // Nếu quantity trong cart <= quantity đã thanh toán, xóa hoàn toàn
            if (cartItem.quantity <= paidQuantity) {
              console.log(`[VNPAY Return] Removing cart item: ${cartKey} (quantity: ${cartItem.quantity})`);
              return false; // Xóa item này
            } else {
              // Nếu quantity trong cart > quantity đã thanh toán, giảm quantity
              console.log(`[VNPAY Return] Reducing quantity for cart item: ${cartKey} from ${cartItem.quantity} to ${cartItem.quantity - paidQuantity}`);
              cartItem.quantity -= paidQuantity;
              return true; // Giữ lại item này với quantity mới
            }
          }
          
          return true; // Giữ lại nếu không phải sản phẩm đã thanh toán
        });
        
        // Clear and repopulate the DocumentArray
        userCart.cartItems.splice(0, userCart.cartItems.length);
        filteredCartItems.forEach(item => userCart.cartItems.push(item));
        
        await userCart.save();
        console.log('[VNPAY Return] Cart cleanup completed successfully');
      }
    } catch (cartError) {
      console.error('[VNPAY Return] Lỗi khi xóa giỏ hàng:', cartError);
      // Không throw error vì order đã tạo thành công
    }

    // Xoá session pendingOrder
    delete req.session.pendingOrder;

    // Tạo response chi tiết với thông tin order
    const orderResponse = {
      status: 'success',
      message: `Đặt hàng và thanh toán thành công với ${savedOrder.orderItems.length} sản phẩm`,
      order: {
        _id: savedOrder._id,
        orderNumber: savedOrder._id,
        totalItems: savedOrder.orderItems.length,
        totalPrice: savedOrder.totalPrice,
        orderStatus: savedOrder.orderStatus,
        paymentStatus: savedOrder.isPaid ? 'Paid' : 'Pending',
        items: savedOrder.orderItems.map((item: any, index: number) => ({
          index: index + 1,
          productName: item.productName,
          quantity: item.quantity,
          size: item.size[0].size,
          color: item.size[0].color,
          price: item.price,
          totalItemPrice: item.price * item.quantity
        })),
        shippingAddress: savedOrder.shippingAddress,
        paymentMethod: savedOrder.paymentMethod,
        createdAt: savedOrder.createdAt
      },
      result: { 
        isSuccess: true, 
        message: `Order created successfully with ${savedOrder.orderItems.length} items`,
        transactionId: req.query['vnp_TransactionNo']
      }
    };

    console.log('[VNPAY Return] Sending success response:', JSON.stringify(orderResponse, null, 2));

    res.json(orderResponse);
  } catch (err) {
    console.error('Lỗi xử lý returnUrl:', err);
    res.status(400).json({ error: 'Xác thực returnUrl thất bại', detail: (err as any)?.message });
  }
};

/**
 * Tạo order từ dữ liệu VNPAY khi session bị mất
 * Lưu ý: Hàm này chỉ tạo order khi có thông tin user thực
 */
async function createOrderFromVnpayData(req: Request, res: Response) {
  try {
    const vnpAmount = parseInt(req.query['vnp_Amount'] as string) / 100; // Chia 100 vì VNPAY nhân 100
    const vnpTxnRef = req.query['vnp_TxnRef'] as string;
    const vnpTransactionNo = req.query['vnp_TransactionNo'] as string;
    const vnpOrderInfo = req.query['vnp_OrderInfo'] as string;
    
    console.log('[VNPAY Return] Attempting to create order from VNPAY data:', {
      amount: vnpAmount,
      txnRef: vnpTxnRef,
      transactionNo: vnpTransactionNo,
      orderInfo: vnpOrderInfo
    });
    
    // Tìm user từ token - BẮT BUỘC phải có user
    let user = null;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      console.log('[VNPAY Return] No token found, cannot create order');
      return res.status(400).json({
        status: 'fail',
        message: 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.',
        result: { isSuccess: false, message: 'User token required' }
      });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      const userId = decoded.userId || decoded.id;
      if (userId) {
        user = await User.findById(userId);
        console.log('[VNPAY Return] Found user from token:', user ? user.email : 'not found');
      }
    } catch (err) {
      console.log('[VNPAY Return] Token verification failed for order creation:', err);
      return res.status(400).json({
        status: 'fail',
        message: 'Token không hợp lệ. Vui lòng đăng nhập lại.',
        result: { isSuccess: false, message: 'Invalid token' }
      });
    }
    
    // Nếu không tìm thấy user, không thể tạo order
    if (!user) {
      console.log('[VNPAY Return] No user found, cannot create order');
      return res.status(400).json({
        status: 'fail',
        message: 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.',
        result: { isSuccess: false, message: 'User not found' }
      });
    }
    
    // Kiểm tra xem có order data từ request body không
    const orderData = req.body;
    if (orderData && orderData.orderItems && Array.isArray(orderData.orderItems)) {
      // Kiểm tra size và màu cho tất cả items
      const invalidItems = orderData.orderItems.filter((item: any) => {
        if (!item.size || !Array.isArray(item.size) || item.size.length === 0) {
          return true;
        }
        const sizeItem = item.size[0];
        return !sizeItem.size || !sizeItem.color;
      });
      
      if (invalidItems.length > 0) {
        console.error('[VNPAY Return] Items missing size or color in order data:', invalidItems);
        return res.status(400).json({
          status: 'fail',
          message: 'Thông tin size và màu không đầy đủ. Vui lòng chọn lại.',
          result: { isSuccess: false, message: 'Size and color required' }
        });
      }
    }
    
    // Tạo order với thông tin user thực
    console.log('[VNPAY Return] Creating order with real user data');
    
    // Nếu có order data từ request body, sử dụng nó
    let orderItems = [];
    if (orderData && orderData.orderItems && Array.isArray(orderData.orderItems)) {
      // Tạo snapshot cho mỗi order item
      orderItems = await Promise.all(
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
    } else {
      // Fallback: tạo placeholder order item nếu không có data
      orderItems = [{
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
      }];
    }
    
    const order = new Order({
      user: user._id,
      userSnapshot: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
      orderItems: orderItems,
      shippingAddress: orderData?.shippingAddress || {
        fullName: user.fullName || 'Khách hàng',
        phone: user.phone || '0123456789',
        street: 'Địa chỉ giao hàng',
        city: 'Hà Nội',
        state: 'Quận 1',
        postalCode: '100000',
        country: 'Việt Nam',
      },
      paymentMethod: 'VNPAY',
      taxPrice: orderData?.taxPrice || 0,
      shippingPrice: orderData?.shippingPrice || 0,
      totalPrice: orderData?.totalPrice || vnpAmount,
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
    console.log('[VNPAY Return] User order created:', savedOrder._id);
    console.log('[VNPAY Return] Order contains items:', savedOrder.orderItems.length);
    
    // Tạo response chi tiết
    const orderResponse = {
      status: 'success',
      message: `Đặt hàng và thanh toán thành công với ${savedOrder.orderItems.length} sản phẩm`,
      order: {
        _id: savedOrder._id,
        orderNumber: savedOrder._id,
        totalItems: savedOrder.orderItems.length,
        totalPrice: savedOrder.totalPrice,
        orderStatus: savedOrder.orderStatus,
        paymentStatus: savedOrder.isPaid ? 'Paid' : 'Pending',
        items: savedOrder.orderItems.map((item: any, index: number) => ({
          index: index + 1,
          productName: item.productName,
          quantity: item.quantity,
          size: item.size[0].size,
          color: item.size[0].color,
          price: item.price,
          totalItemPrice: item.price * item.quantity
        })),
        shippingAddress: savedOrder.shippingAddress,
        paymentMethod: savedOrder.paymentMethod,
        createdAt: savedOrder.createdAt
      },
      result: { 
        isSuccess: true, 
        message: `Order created from VNPAY data with ${savedOrder.orderItems.length} items`,
        transactionId: vnpTransactionNo
      }
    };
    
    console.log('[VNPAY Return] Sending success response from VNPAY data:', JSON.stringify(orderResponse, null, 2));
    
    return res.json(orderResponse);
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