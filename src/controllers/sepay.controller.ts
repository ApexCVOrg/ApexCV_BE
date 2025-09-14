import { Request, Response } from 'express'
import { User } from '../models/User'
import { Order } from '../models/Order'
import { Transaction } from '../models/Transaction'
import jwt from 'jsonwebtoken'

// Extend session type
declare module 'express-session' {
  interface SessionData {
    sepayPayment?: {
      userId: string
      amount: number
      description: string
      sessionId: string
      createdAt: string
    }
  }
}

/**
 * Tạo QR code thanh toán Sepay
 */
export const createSepayPayment = async (req: Request, res: Response) => {
  try {
    console.log('[SEPAY] ====== TẠO PAYMENT ======')
    console.log('[SEPAY] Request body:', JSON.stringify(req.body, null, 2))

    const userId = req.user?._id || req.body.user
    if (!userId) {
      return res.status(400).json({
        error: 'User ID is required for payment',
        detail: 'Please ensure user is authenticated'
      })
    }

    const { amount, description } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Amount is required and must be greater than 0'
      })
    }

    // Tạo sessionId và nhúng vào mô tả để webhook parse lại
    const sessionId = `sepay_${Date.now()}_${userId}`
    const desc = `ApexCV|uid:${userId}|sid:${sessionId}|amt:${amount}`
    // Tạo QR code URL cho Sepay với description chứa định danh
    const qrCodeUrl = `https://qr.sepay.vn/img?bank=MBBank&acc=0949064234&template=compact&amount=${amount}&des=${encodeURIComponent(desc)}`

    // Lưu thông tin thanh toán vào session để xử lý sau
    req.session.sepayPayment = {
      userId: userId,
      amount: amount,
      description: desc,
      sessionId: sessionId,
      createdAt: new Date().toISOString()
    }

    req.session.save((err) => {
      if (err) {
        console.error('[SEPAY] Error saving session:', err)
        return res.status(500).json({
          error: 'Failed to save session',
          detail: 'Please try again'
        })
      }

      console.log('[SEPAY] Session saved successfully')
      res.json({
        success: true,
        qrCodeUrl: qrCodeUrl,
        sessionId: sessionId,
        amount: amount,
        message: 'QR code thanh toán đã được tạo thành công'
      })
    })
  } catch (err) {
    console.error('[SEPAY] Error creating payment:', err)
    res.status(400).json({
      error: 'Tạo QR code thanh toán thất bại',
      detail: (err as any)?.message
    })
  }
}

/**
 * Webhook từ Sepay khi thanh toán thành công
 */
export const sepayWebhook = async (req: Request, res: Response) => {
  try {
    console.log('[SEPAY Webhook] ====== WEBHOOK TỪ SEPAY ======')
    
    // 1. API Key validation
    const authHeader = req.headers.authorization
    const expectedApiKey = process.env.SEPAY_WEBHOOK_KEY
    
    if (!expectedApiKey) {
      console.error('[SEPAY Webhook] SEPAY_WEBHOOK_KEY not configured')
      return res.status(401).json({ success: false, message: 'Webhook key not configured' })
    }
    
    if (!authHeader || !authHeader.startsWith('Apikey ')) {
      console.log('[SEPAY Webhook] Missing or invalid Authorization header:', authHeader)
      return res.status(401).json({ success: false, message: 'Invalid API Key' })
    }
    
    const receivedApiKey = authHeader.substring(7) // Remove 'Apikey ' prefix
    if (receivedApiKey !== expectedApiKey) {
      console.log('[SEPAY Webhook] API Key mismatch. Expected:', expectedApiKey, 'Received:', receivedApiKey)
      return res.status(401).json({ success: false, message: 'Invalid API Key' })
    }
    
    console.log('[SEPAY Webhook] API Key validation passed')
    
    // 2. Keep logging for debug
    try {
      console.log('[SEPAY Webhook] Raw body type:', typeof req.body)
      console.log('[SEPAY Webhook] Request body:', JSON.stringify(req.body, null, 2))
      console.log('[SEPAY Webhook] Headers:', JSON.stringify(req.headers, null, 2))
    } catch (logErr) {
      console.log('[SEPAY Webhook] Could not stringify body/headers for log:', logErr)
    }

    // 1. Map payload fields correctly from real Sepay webhook format
    const { 
      referenceCode, 
      id, 
      transferAmount, 
      content, 
      description,
      gateway,
      transactionDate,
      accountNumber
    } = req.body

    // Use referenceCode or fallback to id as transactionId
    const transactionId = referenceCode || id?.toString()
    // Use transferAmount as amount
    const numericAmount = Number(transferAmount)
    // Use content or fallback to description as transaction description
    const transactionDescription = content || description || 'Sepay payment'
    // Always treat as success since Sepay only calls webhook for successful transactions
    const status = 'success'

    console.log('[SEPAY Webhook] Mapped fields:', {
      transactionId,
      amount: numericAmount,
      description: transactionDescription,
      gateway,
      accountNumber
    })

    if (!transactionId || isNaN(numericAmount)) {
      console.log('[SEPAY Webhook] Invalid webhook data - missing transactionId or invalid amount')
      return res.json({ success: false, message: 'Invalid webhook data' })
    }

    // 3. Transaction handling - Check if transactionId already exists
    const existingTransaction = await Transaction.findOne({ transactionId })
    if (existingTransaction) {
      console.log('[SEPAY Webhook] Transaction already processed:', transactionId)
      return res.json({ success: true, message: 'Transaction already processed' })
    }

    // 2. Extract userId from description using regex
    let finalUserId = null
    const descriptionText = transactionDescription || ''
    
    // Use regex /uid([a-zA-Z0-9]+)/ to find the UID
    const uidMatch = descriptionText.match(/uid([a-zA-Z0-9]+)/)
    if (uidMatch && uidMatch[1]) {
      finalUserId = uidMatch[1]
      console.log('[SEPAY Webhook] Parsed userId from description:', finalUserId)
    }
    
    if (!finalUserId) {
      console.log('[SEPAY Webhook] User not found in description:', descriptionText)
      return res.json({ success: false, message: 'User not found in description' })
    }

    // Tìm user
    const user = await User.findById(finalUserId)
    if (!user) {
      console.log('[SEPAY Webhook] User not found in database:', finalUserId)
      return res.json({ success: false, message: 'User not found in description' })
    }

    // Parse sessionId from description for transaction record
    const sidMatch = descriptionText.match(/sid([a-zA-Z0-9]+)/)
    const parsedSessionId = sidMatch && sidMatch[1]

    // 3. Transaction handling - Add points to user (1 VND = 1 point)
    const pointsToAdd = Math.floor(numericAmount)
    const oldPoints = user.points || 0
    user.points = oldPoints + pointsToAdd
    await user.save()

    // Create Transaction record
    const transaction = new Transaction({
      userId: user._id,
      type: 'sepay_payment',
      amount: numericAmount,
      points: pointsToAdd,
      transactionId: transactionId,
      sessionId: parsedSessionId || undefined,
      description: transactionDescription,
      status: 'completed'
    })
    
    await transaction.save()

    console.log('[SEPAY Webhook] Payment processed successfully:', {
      userId: user._id,
      transactionId: transactionId,
      amount: numericAmount,
      pointsAdded: pointsToAdd,
      oldBalance: oldPoints,
      newBalance: user.points,
      gateway: gateway,
      accountNumber: accountNumber
    })

    // 4. Response format - Always return HTTP 200 with JSON
    return res.json({ 
      success: true, 
      message: 'Payment processed successfully', 
      newBalance: user.points 
    })
  } catch (err) {
    console.error('[SEPAY Webhook] Error processing webhook:', err)
    // Always return HTTP 200 to avoid Sepay retry loops
    return res.json({ success: false, message: 'Webhook processing failed', detail: (err as any)?.message })
  }
}

/**
 * Xác nhận thanh toán Sepay (manual - cho testing)
 */
export const confirmSepayPayment = async (req: Request, res: Response) => {
  try {
    console.log('[SEPAY] ====== XÁC NHẬN THANH TOÁN ======')
    console.log('[SEPAY] Request body:', JSON.stringify(req.body, null, 2))

    const { sessionId, transactionId, amount } = req.body

    if (!sessionId || !transactionId || !amount) {
      return res.status(400).json({
        error: 'Missing required fields: sessionId, transactionId, amount'
      })
    }

    // Lấy thông tin thanh toán từ session
    const paymentData = req.session.sepayPayment
    if (!paymentData || paymentData.sessionId !== sessionId) {
      return res.status(400).json({
        error: 'Invalid session or payment data not found'
      })
    }

    // Kiểm tra amount với tolerance ±1 VND
    const expected = Number(paymentData.amount)
    const received = Number(amount)
    if (isNaN(expected) || isNaN(received)) {
      return res.status(400).json({ error: 'Invalid amount' })
    }
    const diff = Math.abs(expected - received)
    if (diff > 1) {
      console.log('[SEPAY Confirm] Amount mismatch beyond tolerance:', { expected, received, diff })
      return res.status(400).json({ error: 'Amount mismatch (beyond tolerance)' })
    }

    // Tìm user
    const user = await User.findById(paymentData.userId)
    if (!user) {
      return res.status(400).json({
        error: 'User not found'
      })
    }

    // Cập nhật điểm cho user (1 VND = 1 điểm)
    const pointsToAdd = Math.floor(received)
    user.points = (user.points || 0) + pointsToAdd
    await user.save()

    // Tạo transaction record
    const transaction = new Transaction({
      userId: user._id,
      type: 'sepay_payment',
      amount: received,
      points: pointsToAdd,
      transactionId: transactionId,
      sessionId: sessionId,
      description: paymentData.description,
      status: 'completed'
    })
    
    await transaction.save()

    // Xóa session sau khi xử lý thành công
    delete req.session.sepayPayment
    req.session.save()

    console.log('[SEPAY] Payment confirmed successfully:', {
      userId: user._id,
      amount: amount,
      pointsAdded: pointsToAdd,
      newBalance: user.points
    })

    res.json({
      success: true,
      message: `Thanh toán thành công! Bạn đã nhận được ${pointsToAdd} điểm`,
      data: {
        transaction: {
          id: transaction._id,
          type: transaction.type,
          amount: transaction.amount,
          points: transaction.points,
          transactionId: transaction.transactionId,
          status: transaction.status,
          createdAt: transaction.createdAt
        },
        user: {
          id: user._id,
          points: user.points
        }
      },
      newBalance: user.points
    })
  } catch (err) {
    console.error('[SEPAY] Error confirming payment:', err)
    res.status(500).json({
      error: 'Xác nhận thanh toán thất bại',
      detail: (err as any)?.message
    })
  }
}

/**
 * Kiểm tra trạng thái thanh toán (polling)
 */
export const checkPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params
    const userId = req.user?._id

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' })
    }

    // Kiểm tra xem có giao dịch nào với sessionId này không
    let transaction = await Transaction.findOne({ 
      sessionId: sessionId,
      userId: userId,
      status: 'completed'
    })

    // Fallback: nếu webhook chưa gán sessionId, thử khớp theo amount và thời gian từ session
    if (!transaction && req.session.sepayPayment && req.session.sepayPayment.sessionId === sessionId) {
      const sessionAmount = Number(req.session.sepayPayment.amount)
      const sessionCreatedAt = new Date(req.session.sepayPayment.createdAt)
      const oneHourAfter = new Date(sessionCreatedAt.getTime() + 60 * 60 * 1000)

      // Tìm giao dịch hoàn tất cho user, trùng amount, tạo trong khoảng phiên
      const candidate = await Transaction.findOne({
        userId: userId,
        status: 'completed',
        amount: sessionAmount,
        createdAt: { $gte: sessionCreatedAt, $lte: oneHourAfter }
      }).sort({ createdAt: -1 })

      if (candidate) {
        // Gán liên kết sessionId để các lần gọi sau match nhanh hơn
        candidate.sessionId = sessionId
        await candidate.save()
        transaction = candidate
      }
    }

    if (transaction) {
      // Lấy thông tin user mới nhất
      const user = await User.findById(userId).select('points')
      
      res.json({
        success: true,
        paid: true,
        transaction: {
          id: transaction._id,
          amount: transaction.amount,
          points: transaction.points,
          createdAt: transaction.createdAt
        },
        user: {
          points: user?.points || 0
        }
      })
    } else {
      res.json({
        success: true,
        paid: false,
        message: 'Payment not completed yet'
      })
    }
  } catch (err) {
    console.error('[SEPAY] Error checking payment status:', err)
    res.status(500).json({
      error: 'Lỗi kiểm tra trạng thái thanh toán',
      detail: (err as any)?.message
    })
  }
}

/**
 * Lấy thông tin điểm của user
 */
export const getUserPoints = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id
    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated'
      })
    }

    const user = await User.findById(userId).select('points username email')
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    res.json({
      success: true,
      data: {
        userId: user._id,
        username: user.username,
        email: user.email,
        points: user.points || 0
      }
    })
  } catch (err) {
    console.error('[SEPAY] Error getting user points:', err)
    res.status(500).json({
      error: 'Lấy thông tin điểm thất bại',
      detail: (err as any)?.message
    })
  }
}

/**
 * Lịch sử giao dịch điểm
 */
export const getPointsHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id
    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated'
      })
    }

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    // Lấy lịch sử giao dịch
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('type amount points transactionId description status createdAt')

    // Đếm tổng số giao dịch
    const total = await Transaction.countDocuments({ userId })

    res.json({
      success: true,
      data: {
        history: transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (err) {
    console.error('[SEPAY] Error getting points history:', err)
    res.status(500).json({
      error: 'Lấy lịch sử điểm thất bại',
      detail: (err as any)?.message
    })
  }
}
