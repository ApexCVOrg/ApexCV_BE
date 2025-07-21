import { Router } from 'express';
import { createPayment, handleReturnUrl, handleIpn } from '../controllers/vnpay.controller';
import { checkUserAuth } from '../middlewares/checkUserAuth';
import { validateOrderItems, validateShippingAddress } from '../middlewares/validateOrder';

const router = Router();

// Tạo link thanh toán - yêu cầu user đăng nhập và validate order data
router.post('/vnpay', checkUserAuth, validateOrderItems, validateShippingAddress, createPayment);

// Xử lý returnUrl (user redirect về) - không cần auth vì VNPAY gọi về
router.get('/vnpay/return', handleReturnUrl);

// Xử lý IPN (VNPAY gọi về) - không cần auth
router.get('/vnpay/ipn', handleIpn);

export default router;
