import { Router } from 'express';
import { createPayment, handleReturnUrl, handleIpn } from '../controllers/vnpay.controller';

const router = Router();

// Tạo link thanh toán
router.post('/vnpay', createPayment,);
// Xử lý returnUrl (user redirect về)
router.get('/vnpay/return', handleReturnUrl);
// Xử lý IPN (server-to-server notification)
router.get('/vnpay/ipn', handleIpn);

export default router; 