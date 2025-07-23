import { VNPay } from '../lib/vnpay/vnpay'
import type { BuildPaymentUrl, ReturnQueryFromVNPay } from '../lib/vnpay/types'
import { VnpCurrCode, VnpLocale, ProductCode } from '../lib/vnpay/enums'

// VNPAY Configuration from environment variables
const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMNCODE || 'ROJ5KGHQ',
  secureSecret: process.env.VNP_SECRET || '10KO2R5UHJ1X4HX42PUS6KH8WINLYE0A',
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: process.env.NODE_ENV !== 'production'
})

/**
 * Tạo link thanh toán VNPAY
 */
export function createVnpayPayment(data: BuildPaymentUrl) {
  console.log('[VNPAY Service] Bắt đầu tạo payment URL')
  console.log('[VNPAY Service] VNPAY Config:', {
    tmnCode: process.env.VNP_TMNCODE || 'ROJ5KGHQ',
    secureSecret: process.env.VNP_SECRET ? '***' : 'NOT_SET',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true
  })
  console.log('[VNPAY Service] Payment data:', JSON.stringify(data, null, 2))

  try {
    // Import dateFormat utility
    const { dateFormat } = require('../lib/vnpay/utils/common')

    // Chỉ lấy các trường cần thiết cho VNPAY, loại bỏ các trường không cần thiết
    const vnpayData = {
      vnp_Amount: data.vnp_Amount,
      vnp_IpAddr: data.vnp_IpAddr,
      vnp_ReturnUrl: data.vnp_ReturnUrl,
      vnp_TxnRef: data.vnp_TxnRef,
      vnp_OrderInfo: data.vnp_OrderInfo,
      // Thêm các trường VNPAY bắt buộc
      vnp_CurrCode: VnpCurrCode.VND,
      vnp_Locale: VnpLocale.VN,
      vnp_OrderType: ProductCode.Other,
      // Format date đúng cho VNPAY
      vnp_ExpireDate: data.vnp_ExpireDate ? dateFormat(new Date(data.vnp_ExpireDate * 1000)) : undefined,
      vnp_CreateDate: dateFormat(new Date())
    }

    console.log('[VNPAY Service] Cleaned VNPAY data:', JSON.stringify(vnpayData, null, 2))

    const url = vnpay.buildPaymentUrl(vnpayData)
    console.log('[VNPAY Service] Generated URL:', url)
    return url
  } catch (error) {
    console.error('[VNPAY Service] Error building payment URL:', error)
    throw error
  }
}

/**
 * Xác thực callback từ VNPAY (returnUrl)
 */
export function verifyVnpayReturn(query: ReturnQueryFromVNPay) {
  console.log('[VNPAY Service] Bắt đầu verify returnUrl')
  console.log('[VNPAY Service] Query data:', JSON.stringify(query, null, 2))
  console.log('[VNPAY Service] VNPAY Config for verification:', {
    tmnCode: process.env.VNP_TMNCODE || 'ROJ5KGHQ',
    secureSecret: process.env.VNP_SECRET ? '***' : 'NOT_SET'
  })

  try {
    const result = vnpay.verifyReturnUrl(query)
    console.log('[VNPAY Service] Verification result:', JSON.stringify(result, null, 2))
    return result
  } catch (error) {
    console.error('[VNPAY Service] Error verifying returnUrl:', error)
    throw error
  }
}

/**
 * Xác thực IPN từ VNPAY
 */
export function verifyVnpayIpn(query: ReturnQueryFromVNPay) {
  return vnpay.verifyIpnCall(query)
}
