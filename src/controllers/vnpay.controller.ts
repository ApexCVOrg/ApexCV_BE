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
      shippingPrice: 50000, // Luôn là 50.000 VND
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
    
    // Kiểm tra response code từ VNPay trước tiên
    const vnpResponseCode = req.query['vnp_ResponseCode'];
    const vnpTransactionNo = req.query['vnp_TransactionNo'];
    const vnpTxnRef = req.query['vnp_TxnRef'];
    const vnpAmount = req.query['vnp_Amount'];
    
    console.log('[VNPAY Return] VNPay Response Code:', vnpResponseCode);
    console.log('[VNPAY Return] VNPay Transaction No:', vnpTransactionNo);
    console.log('[VNPAY Return] VNPay TxnRef:', vnpTxnRef);
    console.log('[VNPAY Return] VNPay Amount:', vnpAmount);
    
    // Kiểm tra xem transaction này đã được xử lý chưa
    if (vnpTransactionNo) {
      const existingOrder = await Order.findOne({ 'paymentResult.id': vnpTransactionNo });
      if (existingOrder) {
        console.log('[VNPAY Return] Order already exists:', existingOrder._id);
        return res.json({ 
          status: 'success', 
          message: 'Đơn hàng đã tồn tại', 
          order: {
            _id: existingOrder._id,
            orderNumber: existingOrder._id,
            totalItems: existingOrder.orderItems.length,
            totalPrice: existingOrder.totalPrice,
            orderStatus: existingOrder.orderStatus,
            paymentStatus: existingOrder.isPaid ? 'Paid' : 'Pending',
            items: existingOrder.orderItems.map((item: any, index: number) => ({
              index: index + 1,
              productName: item.productName || item.name,
              quantity: item.quantity,
              size: item.size[0]?.size || 'N/A',
              color: item.size[0]?.color || 'N/A',
              price: item.price,
              totalItemPrice: item.price * item.quantity
            })),
            shippingAddress: {
              fullName: existingOrder.shippingAddress?.recipientName || 'N/A',
              street: existingOrder.shippingAddress?.street || 'N/A',
              city: existingOrder.shippingAddress?.city || 'N/A',
              state: existingOrder.shippingAddress?.state || 'N/A',
              postalCode: existingOrder.shippingAddress?.postalCode || 'N/A',
              country: existingOrder.shippingAddress?.country || 'N/A',
              phone: existingOrder.shippingAddress?.phone || 'N/A',
            },
            paymentMethod: existingOrder.paymentMethod,
            createdAt: existingOrder.createdAt
          },
          result: { isSuccess: true, message: 'Order already processed' }
        });
      }
    }
    
    // Xác thực response từ VNPay
    let verificationResult;
    try {
      verificationResult = verifyVnpayReturn(req.query as any);
      console.log('[VNPAY Return] Verification result:', JSON.stringify(verificationResult, null, 2));
    } catch (verifyError) {
      console.error('[VNPAY Return] Verification error:', verifyError);
      verificationResult = { isSuccess: false, message: 'Verification failed' };
    }
    
    // Kiểm tra các điều kiện để xác định thanh toán thành công
    const isPaymentSuccess = 
      vnpResponseCode === '00' && // Response code thành công
      verificationResult.isSuccess && // Verification thành công
      vnpTransactionNo && // Có transaction number
      vnpAmount; // Có amount
    
    console.log('[VNPAY Return] Payment success check:', {
      responseCode: vnpResponseCode,
      verificationSuccess: verificationResult.isSuccess,
      hasTransactionNo: !!vnpTransactionNo,
      hasAmount: !!vnpAmount,
      isPaymentSuccess
    });
    
    // Nếu thanh toán không thành công, chỉ log và return thông báo
    if (!isPaymentSuccess) {
      console.log('[VNPAY Return] Payment failed or cancelled. Response code:', vnpResponseCode);
      
      // Xóa session và backup data nếu có
      if (req.session.pendingOrder) {
        delete req.session.pendingOrder;
        req.session.save();
      }
      
      // Xóa backup data từ database
      if (vnpTxnRef) {
        try {
          await PendingOrder.deleteMany({ 'orderData.sessionId': vnpTxnRef });
          console.log('[VNPAY Return] Cleaned up backup data for failed payment');
        } catch (cleanupError) {
          console.error('[VNPAY Return] Error cleaning up backup data:', cleanupError);
        }
      }
      
      // Return thông báo phù hợp với từng trường hợp
      let errorMessage = 'Thanh toán không thành công';
      if (vnpResponseCode === '24') {
        errorMessage = 'Khách hàng hủy giao dịch';
      } else if (vnpResponseCode === '07') {
        errorMessage = 'Giao dịch bị nghi ngờ gian lận';
      } else if (vnpResponseCode === '09') {
        errorMessage = 'Giao dịch không thành công do: Thẻ/Tài khoản bị khóa';
      } else if (vnpResponseCode === '10') {
        errorMessage = 'Giao dịch không thành công do: Khách hàng chưa kích hoạt thẻ';
      } else if (vnpResponseCode === '11') {
        errorMessage = 'Giao dịch không thành công do: Thẻ/Tài khoản chưa đăng ký dịch vụ';
      } else if (vnpResponseCode === '12') {
        errorMessage = 'Giao dịch không thành công do: Thẻ/Tài khoản bị khóa';
      } else if (vnpResponseCode === '13') {
        errorMessage = 'Giao dịch không thành công do: Nhập sai mật khẩu xác thực giao dịch';
      } else if (vnpResponseCode === '51') {
        errorMessage = 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư';
      } else if (vnpResponseCode === '65') {
        errorMessage = 'Giao dịch không thành công do: Tài khoản của quý khách đã vượt quá hạn mức cho phép';
      } else if (vnpResponseCode === '75') {
        errorMessage = 'Giao dịch không thành công do: Ngân hàng thanh toán đang bảo trì';
      } else if (vnpResponseCode === '79') {
        errorMessage = 'Giao dịch không thành công do: Khách hàng nhập sai mật khẩu thanh toán quá số lần quy định';
      } else if (vnpResponseCode === '99') {
        errorMessage = 'Giao dịch không thành công do: Lỗi khác';
      }
      
      return res.json({
        status: 'fail',
        message: errorMessage,
        result: { 
          isSuccess: false, 
          message: `Payment failed with response code: ${vnpResponseCode}`,
          responseCode: vnpResponseCode
        }
      });
    }
    
    // Nếu thanh toán thành công, tiếp tục xử lý tạo order
    console.log('[VNPAY Return] Payment successful, proceeding to create order');
    
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
        console.log(`[VNPAY Return] Processing item ${index + 1}:`, {
          product: item.product,
          name: item.name,
          quantity: item.quantity,
          size: item.size,
          price: item.price
        });
        
        const product = await Product.findById(item.product).populate('brand');
        console.log(`[VNPAY Return] Found product for item ${index + 1}:`, product ? {
          id: product._id,
          name: product.name,
          brand: (product.brand as any)?.name
        } : 'not found');
        
        // Tạo sku từ size và color nếu không có
        const sizeWithSku = item.size.map((sizeItem: any) => ({
          ...sizeItem,
          sku: sizeItem.sku || `${product?.name || 'product'}_${sizeItem.size}_${sizeItem.color || 'default'}`.replace(/\s+/g, '_').toUpperCase()
        }));
        
        const populatedItem = {
          ...item,
          size: sizeWithSku,
          productName: product?.name || item.name || '',
          productImage: product?.images?.[0] || '',
          productBrand: (product?.brand as any)?.name || '',
        };
        
        console.log(`[VNPAY Return] Populated item ${index + 1}:`, {
          productName: populatedItem.productName,
          quantity: populatedItem.quantity,
          size: populatedItem.size[0]?.size,
          color: populatedItem.size[0]?.color,
          price: populatedItem.price
        });
        
        return populatedItem;
      })
    );

    console.log('[VNPAY Return] All items populated successfully, creating order...');
    console.log('[VNPAY Return] Final populated items:', JSON.stringify(populatedOrderItems, null, 2));

    // Tạo đơn hàng mới với thông tin user thực
    const order = new Order({
      user: finalUserId,
      userSnapshot: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
      orderItems: populatedOrderItems,
      shippingAddress: {
        recipientName: orderData.shippingAddress.fullName || 'N/A',
        street: orderData.shippingAddress.street,
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.state,
        postalCode: orderData.shippingAddress.postalCode,
        country: orderData.shippingAddress.country,
        phone: orderData.shippingAddress.phone || user.phone,
      },
      paymentMethod: orderData.paymentMethod,
      taxPrice: orderData.taxPrice || 0,
      shippingPrice: 50000, // Luôn là 50.000 VND
      totalPrice: orderData.totalPrice,
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
    console.log('[VNPAY Return] Order created successfully:', savedOrder._id);
    console.log('[VNPAY Return] Order contains items:', savedOrder.orderItems.length);
    console.log('[VNPAY Return] Order total price:', savedOrder.totalPrice);
    console.log('[VNPAY Return] Order items summary:', savedOrder.orderItems.map((item: any, index: number) => ({
      index: index + 1,
      productName: item.productName || item.name,
      quantity: item.quantity,
      size: item.size[0]?.size || 'N/A',
      color: item.size[0]?.color || 'N/A',
      price: item.price
    })));
    
    // Log chi tiết từng item trong saved order
    console.log('[VNPAY Return] Detailed saved order items:');
    savedOrder.orderItems.forEach((item: any, index: number) => {
      console.log(`[VNPAY Return] Item ${index + 1}:`, {
        product: item.product,
        productName: item.productName,
        name: item.name,
        quantity: item.quantity,
        size: item.size,
        price: item.price
      });
    });

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
      console.error('[VNPAY Return] Error cleaning up cart:', cartError);
      // Không throw error vì order đã được tạo thành công
    }

    // Xóa session sau khi tạo order thành công
    if (req.session.pendingOrder) {
    delete req.session.pendingOrder;
      req.session.save();
      console.log('[VNPAY Return] Session cleaned up after successful order creation');
    }

    // Tạo response thành công
    const successResponse = {
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
          productName: item.productName || item.name,
          quantity: item.quantity,
          size: item.size[0]?.size || 'N/A',
          color: item.size[0]?.color || 'N/A',
          price: item.price,
          totalItemPrice: item.price * item.quantity
        })),
        shippingAddress: {
          fullName: savedOrder.shippingAddress?.recipientName || 'N/A',
          street: savedOrder.shippingAddress?.street || 'N/A',
          city: savedOrder.shippingAddress?.city || 'N/A',
          state: savedOrder.shippingAddress?.state || 'N/A',
          postalCode: savedOrder.shippingAddress?.postalCode || 'N/A',
          country: savedOrder.shippingAddress?.country || 'N/A',
          phone: savedOrder.shippingAddress?.phone || 'N/A',
        },
        paymentMethod: savedOrder.paymentMethod,
        createdAt: savedOrder.createdAt
      },
      result: { 
        isSuccess: true, 
        message: `Order created successfully with ${savedOrder.orderItems.length} items`,
        transactionId: vnpTransactionNo,
        responseCode: vnpResponseCode
      }
    };

    console.log('[VNPAY Return] Sending success response:', JSON.stringify(successResponse, null, 2));
    res.json(successResponse);

  } catch (err) {
    console.error('[VNPAY Return] Error processing return URL:', err);
    res.status(500).json({ 
      status: 'error', 
      message: 'Có lỗi xảy ra khi xử lý thanh toán', 
      detail: (err as any)?.message 
    });
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
    const vnpResponseCode = req.query['vnp_ResponseCode'] as string;
    
    console.log('[VNPAY Return] Attempting to create order from VNPAY data:', {
      amount: vnpAmount,
      txnRef: vnpTxnRef,
      transactionNo: vnpTransactionNo,
      orderInfo: vnpOrderInfo,
      responseCode: vnpResponseCode
    });
    
    // Kiểm tra response code trước tiên
    if (vnpResponseCode !== '00') {
      console.log('[VNPAY Return] Payment failed with response code:', vnpResponseCode);
      let errorMessage = 'Thanh toán không thành công';
      if (vnpResponseCode === '24') {
        errorMessage = 'Khách hàng hủy giao dịch';
      } else if (vnpResponseCode === '07') {
        errorMessage = 'Giao dịch bị nghi ngờ gian lận';
      } else if (vnpResponseCode === '09') {
        errorMessage = 'Giao dịch không thành công do: Thẻ/Tài khoản bị khóa';
      } else if (vnpResponseCode === '10') {
        errorMessage = 'Giao dịch không thành công do: Khách hàng chưa kích hoạt thẻ';
      } else if (vnpResponseCode === '11') {
        errorMessage = 'Giao dịch không thành công do: Thẻ/Tài khoản chưa đăng ký dịch vụ';
      } else if (vnpResponseCode === '12') {
        errorMessage = 'Giao dịch không thành công do: Thẻ/Tài khoản bị khóa';
      } else if (vnpResponseCode === '13') {
        errorMessage = 'Giao dịch không thành công do: Nhập sai mật khẩu xác thực giao dịch';
      } else if (vnpResponseCode === '51') {
        errorMessage = 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư';
      } else if (vnpResponseCode === '65') {
        errorMessage = 'Giao dịch không thành công do: Tài khoản của quý khách đã vượt quá hạn mức cho phép';
      } else if (vnpResponseCode === '75') {
        errorMessage = 'Giao dịch không thành công do: Ngân hàng thanh toán đang bảo trì';
      } else if (vnpResponseCode === '79') {
        errorMessage = 'Giao dịch không thành công do: Khách hàng nhập sai mật khẩu thanh toán quá số lần quy định';
      } else if (vnpResponseCode === '99') {
        errorMessage = 'Giao dịch không thành công do: Lỗi khác';
      }
      
      return res.status(400).json({
        status: 'fail',
        message: errorMessage,
        result: { 
          isSuccess: false, 
          message: `Payment failed with response code: ${vnpResponseCode}`,
          responseCode: vnpResponseCode
        }
      });
    }
    
    // Kiểm tra xem transaction này đã được xử lý chưa
    if (vnpTransactionNo) {
      const existingOrder = await Order.findOne({ 'paymentResult.id': vnpTransactionNo });
      if (existingOrder) {
        console.log('[VNPAY Return] Order already exists:', existingOrder._id);
        return res.json({ 
          status: 'success', 
          message: 'Đơn hàng đã tồn tại', 
          order: {
            _id: existingOrder._id,
            orderNumber: existingOrder._id,
            totalItems: existingOrder.orderItems.length,
            totalPrice: existingOrder.totalPrice,
            orderStatus: existingOrder.orderStatus,
            paymentStatus: existingOrder.isPaid ? 'Paid' : 'Pending',
            items: existingOrder.orderItems.map((item: any, index: number) => ({
              index: index + 1,
              productName: item.productName || item.name,
              quantity: item.quantity,
              size: item.size[0]?.size || 'N/A',
              color: item.size[0]?.color || 'N/A',
              price: item.price,
              totalItemPrice: item.price * item.quantity
            })),
            shippingAddress: {
              fullName: existingOrder.shippingAddress?.recipientName || 'N/A',
              street: existingOrder.shippingAddress?.street || 'N/A',
              city: existingOrder.shippingAddress?.city || 'N/A',
              state: existingOrder.shippingAddress?.state || 'N/A',
              postalCode: existingOrder.shippingAddress?.postalCode || 'N/A',
              country: existingOrder.shippingAddress?.country || 'N/A',
              phone: existingOrder.shippingAddress?.phone || 'N/A',
            },
            paymentMethod: existingOrder.paymentMethod,
            createdAt: existingOrder.createdAt
          },
          result: { isSuccess: true, message: 'Order already processed' }
        });
      }
    }
    
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
        fullName: user.username,
        email: user.email,
        phone: user.phone,
      },
      orderItems: orderItems,
      shippingAddress: {
        recipientName: orderData?.shippingAddress?.recipientName || orderData?.shippingAddress?.fullName || user.fullName || 'N/A',
        street: orderData?.shippingAddress?.street,
        city: orderData?.shippingAddress?.city,
        state: orderData?.shippingAddress?.state,
        postalCode: orderData?.shippingAddress?.postalCode,
        country: orderData?.shippingAddress?.country,
        phone: orderData?.shippingAddress?.phone || user.phone,
      },
      paymentMethod: 'VNPAY',
      taxPrice: orderData?.taxPrice || 0,
      shippingPrice: 50000, // Luôn là 50.000 VND
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
          productName: item.productName || item.name,
          quantity: item.quantity,
          size: item.size[0]?.size || 'N/A',
          color: item.size[0]?.color || 'N/A',
          price: item.price,
          totalItemPrice: item.price * item.quantity
        })),
        shippingAddress: {
          fullName: savedOrder.shippingAddress?.recipientName || 'N/A',
          street: savedOrder.shippingAddress?.street || 'N/A',
          city: savedOrder.shippingAddress?.city || 'N/A',
          state: savedOrder.shippingAddress?.state || 'N/A',
          postalCode: savedOrder.shippingAddress?.postalCode || 'N/A',
          country: savedOrder.shippingAddress?.country || 'N/A',
          phone: savedOrder.shippingAddress?.phone || 'N/A',
        },
        paymentMethod: savedOrder.paymentMethod,
        createdAt: savedOrder.createdAt
      },
      result: { 
        isSuccess: true, 
        message: `Order created from VNPAY data with ${savedOrder.orderItems.length} items`,
        transactionId: vnpTransactionNo,
        responseCode: vnpResponseCode
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
    console.log('[VNPAY IPN] Bắt đầu xử lý IPN');
    console.log('[VNPAY IPN] Query params:', JSON.stringify(req.query, null, 2));
    
    const vnpResponseCode = req.query['vnp_ResponseCode'];
    const vnpTransactionNo = req.query['vnp_TransactionNo'];
    const vnpTxnRef = req.query['vnp_TxnRef'];
    
    console.log('[VNPAY IPN] VNPay Response Code:', vnpResponseCode);
    console.log('[VNPAY IPN] VNPay Transaction No:', vnpTransactionNo);
    console.log('[VNPAY IPN] VNPay TxnRef:', vnpTxnRef);
    
    // Xác thực IPN từ VNPay
    let verificationResult;
    try {
      verificationResult = verifyVnpayIpn(req.query as any);
      console.log('[VNPAY IPN] Verification result:', JSON.stringify(verificationResult, null, 2));
    } catch (verifyError) {
      console.error('[VNPAY IPN] Verification error:', verifyError);
      verificationResult = { isSuccess: false, message: 'Verification failed' };
    }
    
    // Kiểm tra các điều kiện để xác định thanh toán thành công
    const isPaymentSuccess = 
      vnpResponseCode === '00' && // Response code thành công
      verificationResult.isSuccess && // Verification thành công
      vnpTransactionNo; // Có transaction number
    
    console.log('[VNPAY IPN] Payment success check:', {
      responseCode: vnpResponseCode,
      verificationSuccess: verificationResult.isSuccess,
      hasTransactionNo: !!vnpTransactionNo,
      isPaymentSuccess
    });
    
    // Nếu thanh toán không thành công, chỉ log và return
    if (!isPaymentSuccess) {
      console.log('[VNPAY IPN] Payment failed or cancelled. Response code:', vnpResponseCode);
      
      // Xóa backup data nếu có
      if (vnpTxnRef) {
        try {
          PendingOrder.deleteMany({ 'orderData.sessionId': vnpTxnRef }).then(() => {
            console.log('[VNPAY IPN] Cleaned up backup data for failed payment');
          }).catch((cleanupError) => {
            console.error('[VNPAY IPN] Error cleaning up backup data:', cleanupError);
          });
        } catch (cleanupError) {
          console.error('[VNPAY IPN] Error cleaning up backup data:', cleanupError);
        }
      }
      
      return res.json({ 
        status: 'fail', 
        message: `Payment failed with response code: ${vnpResponseCode}`,
        result: { 
          isSuccess: false, 
          message: `Payment failed with response code: ${vnpResponseCode}`,
          responseCode: vnpResponseCode
        }
      });
    }
    
    // Nếu thanh toán thành công, có thể cập nhật trạng thái order nếu cần
    console.log('[VNPAY IPN] Payment successful, order should be created via return URL');
    
    // TODO: Có thể thêm logic cập nhật trạng thái order ở đây nếu cần
    // Ví dụ: cập nhật trạng thái từ 'pending' sang 'paid' nếu order đã tồn tại
    
    res.json({ 
      status: 'success', 
      message: 'IPN processed successfully',
      result: { 
        isSuccess: true, 
        message: 'IPN processed successfully',
        responseCode: vnpResponseCode,
        transactionId: vnpTransactionNo
      }
    });
  } catch (err) {
    console.error('[VNPAY IPN] Error processing IPN:', err);
    res.status(400).json({ 
      status: 'error',
      message: 'Xác thực IPN thất bại', 
      detail: (err as any)?.message 
    });
  }
}; 