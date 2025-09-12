import { Router } from 'express'
import { createSepayPayment, confirmSepayPayment, sepayWebhook, checkPaymentStatus, getUserPoints, getPointsHistory } from '../controllers/sepay.controller'
import { checkUserAuth } from '../middlewares/checkUserAuth'

const router = Router()

// Tạo QR code thanh toán Sepay - yêu cầu user đăng nhập
router.post('/create', checkUserAuth, createSepayPayment)

// Webhook từ Sepay (tự động cộng điểm)
router.post('/webhook', sepayWebhook)

// Xác nhận thanh toán Sepay (manual - cho testing)
router.post('/confirm', confirmSepayPayment)

// Kiểm tra trạng thái thanh toán (polling)
router.get('/status/:sessionId', checkUserAuth, checkPaymentStatus)

// Lấy thông tin điểm của user - yêu cầu user đăng nhập
router.get('/points', checkUserAuth, getUserPoints)

// Lấy lịch sử giao dịch điểm - yêu cầu user đăng nhập
router.get('/points/history', checkUserAuth, getPointsHistory)

export default router
