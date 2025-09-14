import { Router } from 'express'
import { createSepayPayment, confirmSepayPayment, sepayWebhook, checkPaymentStatus, getUserPoints, getPointsHistory } from '../controllers/sepay.controller'
import { checkUserAuth } from '../middlewares/checkUserAuth'
import { SEPAY_ROUTES } from '../constants/routes'

const router = Router()

// Tạo QR code thanh toán Sepay - yêu cầu user đăng nhập
router.post(SEPAY_ROUTES.CREATE, checkUserAuth, createSepayPayment)

// Webhook từ Sepay (tự động cộng điểm)
router.post(SEPAY_ROUTES.WEBHOOK, sepayWebhook)

// Xác nhận thanh toán Sepay (manual - cho testing)
router.post(SEPAY_ROUTES.CONFIRM, confirmSepayPayment)

// Kiểm tra trạng thái thanh toán (polling)
router.get(SEPAY_ROUTES.STATUS, checkUserAuth, checkPaymentStatus)

// Lấy thông tin điểm của user - yêu cầu user đăng nhập
router.get(SEPAY_ROUTES.POINTS, checkUserAuth, getUserPoints)

// Lấy lịch sử giao dịch điểm - yêu cầu user đăng nhập
router.get(SEPAY_ROUTES.POINTS_HISTORY, checkUserAuth, getPointsHistory)

// Test webhook endpoint (for debugging)
router.post('/test-webhook', (req, res) => {
  console.log('[SEPAY Test] Test webhook called')
  console.log('[SEPAY Test] Body:', JSON.stringify(req.body, null, 2))
  res.json({ success: true, message: 'Test webhook received' })
})

export default router
