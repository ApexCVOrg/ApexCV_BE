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

// Manual webhook test endpoint (for debugging)
router.post('/manual-webhook-test', async (req, res) => {
  try {
    console.log('[SEPAY Manual Test] Manual webhook test called')
    
    // Simulate webhook payload
    const testPayload = {
      referenceCode: 'TEST_' + Date.now(),
      transferAmount: 10000,
      content: 'ApexCVuid687f3eef7f449ecaf5b1983fsidsepay_1757861302232_687f3eef7f449ecaf5b1983famt10000',
      description: 'ApexCVuid687f3eef7f449ecaf5b1983fsidsepay_1757861302232_687f3eef7f449ecaf5b1983famt10000',
      gateway: 'MBBank',
      accountNumber: '0949064234'
    }
    
    // Set the test payload as request body
    req.body = testPayload
    
    // Call the webhook function
    const { sepayWebhook } = require('../controllers/sepay.controller')
    await sepayWebhook(req, res)
    
  } catch (error) {
    console.error('[SEPAY Manual Test] Error:', error)
    res.status(500).json({ success: false, message: 'Manual test failed', error: error.message })
  }
})

export default router
