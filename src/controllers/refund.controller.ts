import { Request, Response } from 'express'
import { RefundRequest, Order } from '../models'
import { VNPay } from '../lib/vnpay/vnpay'
import { RefundTransactionType } from '../lib/vnpay/enums'
import { sendVerificationEmail } from '../services/email.service' // Thay bằng hàm gửi mail refund mới nếu cần
import { User } from '../models/User'
import { transporter } from '../services/email.service'

// 1. User gửi yêu cầu refund
export const createRefundRequest = async (req: Request, res: Response) => {
  try {
    const { orderId, txnRef, amount, reason } = req.body
    const userId = req.user?._id || req.body.userId
    // Xử lý ảnh upload
    let images: string[] = []
    if (req.files && Array.isArray(req.files)) {
      images = (req.files as Express.Multer.File[]).map(
        (file) => `${process.env.API_BASE_URL || 'https://nidas-be.onrender.com'}/uploads/${file.filename}`
      )
    }
    if (!orderId || !txnRef || !amount || !reason) {
      return res.status(400).json({ message: 'Thiếu thông tin yêu cầu hoàn tiền' })
    }
    // Kiểm tra order thuộc về user
    const order = await Order.findById(orderId)
    if (!order || String(order.user) !== String(userId)) {
      return res.status(403).json({ message: 'Không có quyền yêu cầu hoàn tiền cho đơn này' })
    }
    // Kiểm tra số lần bị từ chối refund cho order này
    const rejectedCount = await RefundRequest.countDocuments({ orderId, userId, status: 'rejected' })
    if (rejectedCount >= 3) {
      return res.status(403).json({ message: 'Bạn đã bị từ chối hoàn tiền 3 lần, không thể gửi yêu cầu nữa' })
    }
    // Tạo request
    const refund = await RefundRequest.create({
      orderId,
      userId,
      txnRef,
      amount,
      reason,
      status: 'pending',
      images
    })
    res.json({ success: true, refund })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo yêu cầu hoàn tiền', error: err })
  }
}

// 2. User xem lịch sử refund
export const getMyRefundRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id || req.query.userId
    const refunds = await RefundRequest.find({ userId }).sort({ createdAt: -1 })
    res.json({ success: true, refunds })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy lịch sử hoàn tiền', error: err })
  }
}

// 3. Manager xem danh sách refund requests
export const getAllRefundRequests = async (req: Request, res: Response) => {
  try {
    // Có thể filter theo status
    const { status } = req.query
    const query: any = {}
    if (status) query.status = status
    const refunds = await RefundRequest.find(query).populate('orderId userId managerId').sort({ createdAt: -1 })
    res.json({ success: true, refunds })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách hoàn tiền', error: err })
  }
}

// 4. Manager accept refund (gọi VNPAY)
export const acceptRefundRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const managerId = req.user?._id || req.body.managerId
    const refund = await RefundRequest.findById(id)
    if (!refund || refund.status !== 'pending') {
      return res.status(404).json({ message: 'Yêu cầu hoàn tiền không hợp lệ' })
    }
    // Gọi VNPAY refund
    const vnpay = new VNPay({
      tmnCode: process.env.VNPAY_TMN_CODE || 'ROJ5KGHQ',
      secureSecret: process.env.VNPAY_SECRET || '10KO2R5UHJ1X4HX42PUS6KH8WINLYE0A',
      testMode: process.env.VNPAY_TEST === 'true'
    })
    const now = new Date()
    const refundData = {
      vnp_RequestId: `REFUND_${Date.now()}`,
      vnp_TransactionType: RefundTransactionType.FULL_REFUND,
      vnp_TxnRef: refund.txnRef,
      vnp_Amount: refund.amount,
      vnp_TransactionDate: parseInt(
        refund.createdAt
          .toISOString()
          .replace(/[-T:.Z]/g, '')
          .slice(0, 14)
      ),
      vnp_CreateBy: String(managerId),
      vnp_CreateDate: parseInt(
        now
          .toISOString()
          .replace(/[-T:.Z]/g, '')
          .slice(0, 14)
      ),
      vnp_IpAddr: req.ip || '127.0.0.1',
      vnp_OrderInfo: refund.reason
    }
    const vnpayResult = await vnpay.refund(refundData)
    // Cập nhật trạng thái
    refund.status = 'accepted'
    refund.managerId = managerId
    await refund.save()
    // Cập nhật trạng thái đơn hàng thành 'refund' thay vì xóa
    let order = null
    if (refund.orderId) {
      order = await Order.findByIdAndUpdate(refund.orderId, { orderStatus: 'refunded', isPaid: false }, { new: true })
    }
    // Gửi email thông báo cho user
    try {
      let email = ''
      let fullName = ''
      let orderCode = ''
      const refundAmount = refund.amount
      const refundReason = refund.reason
      const shopName = 'NIDAS'
      const supportPhone = '0123456789' // Có thể lấy từ settings nếu có
      if (order) {
        email = order.userSnapshot?.email || ''
        fullName = order.userSnapshot?.fullName || ''
        orderCode = order._id.toString()
      }
      // Nếu không có email từ order, lấy từ user
      if (!email && refund.userId) {
        const user = await User.findById(refund.userId)
        email = user?.email || ''
        fullName = user?.fullName || ''
      }
      if (email) {
        const subject = 'Yêu cầu hoàn tiền của bạn đã được chấp nhận'
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Xin chào ${fullName || 'Quý khách'},</h2>
            <p>Yêu cầu hoàn tiền cho đơn hàng <b>#${orderCode}</b> của bạn đã được <b>chấp nhận</b>.</p>
            <ul>
              <li><b>Số tiền hoàn lại:</b> ${refundAmount.toLocaleString('vi-VN')} VND</li>
              <li><b>Lý do hoàn tiền:</b> ${refundReason}</li>
            </ul>
            <p>Thời gian xử lý: Trong vòng 3-7 ngày làm việc, số tiền sẽ được hoàn về tài khoản/thẻ bạn đã sử dụng để thanh toán.</p>
            <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ bộ phận hỗ trợ khách hàng qua email này hoặc số điện thoại <b>${supportPhone}</b>.</p>
            <p style="margin-top: 32px;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            <p>Trân trọng,<br/>Đội ngũ hỗ trợ ${shopName}</p>
          </div>
        `
        await transporter.sendMail({ from: `"${shopName}" <${process.env.GMAIL_USER}>`, to: email, subject, html })
      }
    } catch (mailErr) {
      console.error('[Refund] Lỗi gửi email hoàn tiền:', mailErr)
    }
    res.json({ success: true, vnpayResult, refund })
  } catch (err) {
    console.error('[Refund] Lỗi duyệt hoàn tiền:', err)
    res.status(500).json({ message: 'Lỗi duyệt hoàn tiền', error: err })
  }
}

// 5. Manager reject refund
export const rejectRefundRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { rejectReason } = req.body
    const managerId = req.user?._id || req.body.managerId
    const refund = await RefundRequest.findById(id)
    if (!refund || refund.status !== 'pending') {
      return res.status(404).json({ message: 'Yêu cầu hoàn tiền không hợp lệ' })
    }
    refund.status = 'rejected'
    refund.managerId = managerId
    refund.rejectReason = rejectReason
    await refund.save()
    // Gửi email thông báo từ chối cho user
    try {
      let email = ''
      let fullName = ''
      let orderCode = ''
      const shopName = 'NIDAS'
      const supportPhone = '0123456789'
      let order = null
      if (refund.orderId) {
        order = await Order.findById(refund.orderId)
        if (order) {
          email = order.userSnapshot?.email || ''
          fullName = order.userSnapshot?.fullName || ''
          orderCode = order._id.toString()
        }
      }
      if (!email && refund.userId) {
        const user = await User.findById(refund.userId)
        email = user?.email || ''
        fullName = user?.fullName || ''
      }
      if (email) {
        const subject = 'Yêu cầu hoàn tiền của bạn đã bị từ chối'
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #d32f2f;">Xin chào ${fullName || 'Quý khách'},</h2>
            <p>Yêu cầu hoàn tiền cho đơn hàng <b>#${orderCode}</b> của bạn đã <b>bị từ chối</b>.</p>
            <ul>
              <li><b>Lý do từ chối:</b> ${rejectReason || 'Không có lý do cụ thể.'}</li>
            </ul>
            <p>Nếu bạn có thắc mắc hoặc cần hỗ trợ thêm, vui lòng liên hệ bộ phận hỗ trợ khách hàng qua email này hoặc số điện thoại <b>${supportPhone}</b>.</p>
            <p style="margin-top: 32px;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            <p>Trân trọng,<br/>Đội ngũ hỗ trợ ${shopName}</p>
          </div>
        `
        await transporter.sendMail({ from: `"${shopName}" <${process.env.GMAIL_USER}>`, to: email, subject, html })
      }
    } catch (mailErr) {
      console.error('[Refund] Lỗi gửi email từ chối hoàn tiền:', mailErr)
    }
    res.json({ success: true, refund })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi từ chối hoàn tiền', error: err })
  }
}

// Lấy lịch sử refund cho 1 order cụ thể của user
export const getRefundHistoryByOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id || req.query.userId
    const { orderId } = req.query
    if (!orderId) return res.status(400).json({ message: 'Thiếu orderId' })
    const refunds = await RefundRequest.find({ userId, orderId }).sort({ createdAt: 1 })
    res.json({ success: true, refunds })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy lịch sử hoàn tiền cho đơn', error: err })
  }
}
