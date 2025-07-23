import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})

/**
 * Verifies the SMTP transporter configuration.
 */
const verifyTransporter = async (): Promise<boolean> => {
  try {
    await transporter.verify()
    console.log('✅ SMTP transporter is configured correctly.')
    return true
  } catch (error) {
    console.error('❌ SMTP verification failed:', error)

    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        console.error('🔧 Use a Gmail App Password instead of your regular password.')
      } else if (error.message.includes('Missing credentials')) {
        console.error('🔧 Ensure GMAIL_USER and GMAIL_PASS are defined in .env.')
      }
    }

    throw error
  }
}

verifyTransporter().catch(console.error)

/**
 * Sends a verification email with a code to the specified email address.
 * @param email - The recipient's email address.
 * @param code - The verification code to send.
 */
export const sendVerificationEmail = async (email: string, code: string): Promise<void> => {
  try {
    if (!email || !code) {
      throw new Error('Email and verification code are required.')
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!isEmailValid) {
      throw new Error('Invalid email format.')
    }

    const mailOptions = {
      from: `"NIDAS" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'NIDAS - Email Verification Code',
      text: `Your NIDAS verification code is: ${code}. This code will expire in 1 minute.`,
      html: generateEmailHTML(code)
    }

    console.log(`📤 Sending email to: ${email}`)
    const info = await transporter.sendMail(mailOptions)
    console.log(`✅ Email sent: ${info.messageId}`)
    console.log(`📨 Response: ${info.response}`)
  } catch (error) {
    console.error('❌ Email send failed:', error)

    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        console.error('🔧 Use Gmail App Password, not your Gmail password.')
      } else if (error.message.includes('Authentication failed')) {
        console.error('🔧 Check credentials and make sure 2FA is setup with App Password.')
      }
    }

    throw new Error(`Email delivery failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generates HTML content for the verification email.
 * @param code - The verification code to embed in the email.
 */
const generateEmailHTML = (code: string): string => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #2563eb; margin: 0;">NIDAS</h1>
      <p style="color: #64748b; margin: 5px 0;">Professional CV Builder</p>
    </div>

    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0;">
      <h2 style="color: white; margin: 0 0 15px 0;">Email Verification</h2>
      <p style="color: #e2e8f0; margin: 0;">Enter this code to verify your email address:</p>
    </div>

    <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
      <div style="font-size: 32px; font-weight: bold; color: #1e293b; letter-spacing: 4px; font-family: 'Courier New', monospace;">
        ${code}
      </div>
    </div>

    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; color: #92400e; font-weight: 500;">⏰ This code will expire in 1 minute</p>
    </div>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <p style="color: #64748b; font-size: 14px; margin: 0;">
        If you didn't request this verification code, please ignore this email.
      </p>
      <p style="color: #64748b; font-size: 12px; margin: 10px 0 0 0;">
        © 2025 NIDAS. All rights reserved.
      </p>
    </div>
  </div>
`
export const sendResetPasswordEmail = async (email: string, otp: string): Promise<void> => {
  try {
    if (!email || !otp) {
      throw new Error('Email and OTP code are required.')
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!isEmailValid) {
      throw new Error('Invalid email format.')
    }

    const mailOptions = {
      from: `"NIDAS" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'NIDAS - Password Reset OTP',
      text: `Your NIDAS password reset OTP is: ${otp}. This code will expire in 1 minute.`,
      html: generateResetPasswordEmailHTML(otp)
    }

    console.log(`📤 Sending password reset email to: ${email}`)
    const info = await transporter.sendMail(mailOptions)
    console.log(`✅ Password reset email sent: ${info.messageId}`)
    console.log(`📨 Response: ${info.response}`)
  } catch (error) {
    console.error('❌ Password reset email send failed:', error)

    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        console.error('🔧 Use Gmail App Password, not your Gmail password.')
      } else if (error.message.includes('Authentication failed')) {
        console.error('🔧 Check credentials and make sure 2FA is setup with App Password.')
      }
    }

    throw new Error(`Email delivery failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
const generateResetPasswordEmailHTML = (otp: string): string => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #2563eb; margin: 0;">NIDAS</h1>
      <p style="color: #64748b; margin: 5px 0;">Professional CV Builder</p>
    </div>

    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0;">
      <h2 style="color: white; margin: 0 0 15px 0;">Password Reset</h2>
      <p style="color: #e2e8f0; margin: 0;">Enter this OTP to reset your password:</p>
    </div>

    <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
      <div style="font-size: 32px; font-weight: bold; color: #1e293b; letter-spacing: 4px; font-family: 'Courier New', monospace;">
        ${otp}
      </div>
    </div>

    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; color: #92400e; font-weight: 500;">⏰ This OTP will expire in 1 minute</p>
    </div>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <p style="color: #64748b; font-size: 14px; margin: 0;">
        If you didn't request a password reset, please ignore this email.
      </p>
      <p style="color: #64748b; font-size: 12px; margin: 10px 0 0 0;">
        © 2025 NIDAS. All rights reserved.
      </p>
    </div>
  </div>
`

export const sendBanUserEmail = async (email: string, reason: string, admin: string, status: string): Promise<void> => {
  try {
    if (!email || !reason) {
      throw new Error('Email and ban reason are required.')
    }
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!isEmailValid) {
      throw new Error('Invalid email format.')
    }
    const mailOptions = {
      from: `"NIDAS" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: status === 'locked' ? 'Your account has been banned' : 'Your account has been unbanned',
      text:
        status === 'locked'
          ? `Your account has been banned by admin (${admin}). Reason: ${reason}`
          : `Your account has been reactivated by admin (${admin}).`,
      html: status === 'locked' ? generateBanUserEmailHTML(reason, admin) : generateUnbanUserEmailHTML(admin)
    }
    console.log(`📤 Sending ban/unban email to: ${email}`)
    const info = await transporter.sendMail(mailOptions)
    console.log(`✅ Ban/unban email sent: ${info.messageId}`)
    console.log(`📨 Response: ${info.response}`)
  } catch (error) {
    console.error('❌ Ban/unban email send failed:', error)
    throw new Error(`Email delivery failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

const generateBanUserEmailHTML = (reason: string, admin: string): string => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #d32f2f; margin: 0;">NIDAS</h1>
      <p style="color: #64748b; margin: 5px 0;">Account Banned Notification</p>
    </div>
    <div style="background: #fff3e0; padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0;">
      <h2 style="color: #d32f2f; margin: 0 0 15px 0;">Your account has been banned</h2>
      <p style="color: #b71c1c; margin: 0;">Reason: <b>${reason}</b></p>
      <p style="color: #b71c1c; margin: 0;">By admin: <b>${admin}</b></p>
    </div>
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; color: #92400e; font-weight: 500;">If you think this is a mistake, please contact support.</p>
    </div>
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <p style="color: #64748b; font-size: 14px; margin: 0;">
        © 2025 NIDAS. All rights reserved.
      </p>
    </div>
  </div>
`

const generateUnbanUserEmailHTML = (admin: string): string => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #388e3c; margin: 0;">NIDAS</h1>
      <p style="color: #64748b; margin: 5px 0;">Account Reactivated</p>
    </div>
    <div style="background: #e8f5e9; padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0;">
      <h2 style="color: #388e3c; margin: 0 0 15px 0;">Your account has been reactivated</h2>
      <p style="color: #1b5e20; margin: 0;">By admin: <b>${admin}</b></p>
    </div>
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <p style="color: #64748b; font-size: 14px; margin: 0;">
        © 2025 NIDAS. All rights reserved.
      </p>
    </div>
  </div>
`

/**
 * Gửi email xác nhận đơn hàng thành công hoặc thất bại
 * @param email - email người nhận
 * @param orderInfo - thông tin đơn hàng (mã đơn, tổng tiền, ...) hoặc lý do thất bại
 * @param isSuccess - true nếu thành công, false nếu thất bại
 */
export const sendOrderStatusEmail = async (
  email: string,
  orderInfo: { orderId?: string; totalPrice?: number; reason?: string },
  isSuccess: boolean
) => {
  if (!email) return
  const subject = isSuccess ? 'Xác nhận đặt hàng thành công' : 'Thanh toán thất bại'
  const html = isSuccess
    ? `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Cảm ơn bạn đã đặt hàng tại NIDAS!</h2>
        <p>Đơn hàng <b>#${orderInfo.orderId}</b> của bạn đã được đặt thành công.</p>
        <ul>
          <li><b>Tổng tiền:</b> ${orderInfo.totalPrice?.toLocaleString('vi-VN')} VND</li>
        </ul>
        <p>Chúng tôi sẽ xử lý đơn hàng và giao đến bạn sớm nhất có thể.</p>
        <p style="margin-top: 32px;">Nếu có thắc mắc, vui lòng liên hệ hỗ trợ.</p>
        <p>Trân trọng,<br/>NIDAS Team</p>
      </div>`
    : `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #d32f2f;">Thanh toán không thành công</h2>
        <p>Đơn hàng của bạn chưa được xác nhận do lỗi thanh toán.</p>
        <p><b>Lý do:</b> ${orderInfo.reason || 'Không xác định'}</p>
        <p>Vui lòng thử lại hoặc liên hệ hỗ trợ nếu cần giúp đỡ.</p>
        <p>Trân trọng,<br/>NIDAS Team</p>
      </div>`
  await transporter.sendMail({
    from: `"NIDAS" <${process.env.GMAIL_USER}>`,
    to: email,
    subject,
    html
  })
}

export { transporter }
