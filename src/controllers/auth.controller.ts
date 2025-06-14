import { Request, Response, RequestHandler } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { OAuth2Client } from 'google-auth-library'
import axios from 'axios'
import { sendVerificationEmail, sendResetPasswordEmail } from '../services/email.service'

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

// Store verification data in memory with expiration
interface VerificationData {
  username: string
  email: string
  passwordHash: string
  fullName: string
  phone: string
  addresses: any[]
  verificationCode: string
  expiresAt: Date
}

const verificationStore = new Map<string, VerificationData>()

// Store for email change verification
const emailChangeStore = new Map<string, { email: string; verificationCode: string; expiresAt: Date }>();

// Clean up expired verification data every hour
setInterval(
  () => {
    const now = new Date()
    for (const [email, data] of verificationStore.entries()) {
      if (data.expiresAt < now) {
        verificationStore.delete(email)
      }
    }
  },
  60 * 60 * 1000
)

// Store reset password data in memory with expiration
interface ResetPasswordData {
  email: string
  otp: string
  expiresAt: Date
}

const resetPasswordStore = new Map<string, ResetPasswordData>()

// Clean up expired reset password data every hour
setInterval(
  () => {
    const now = new Date()
    for (const [email, data] of resetPasswordStore.entries()) {
      if (data.expiresAt < now) {
        resetPasswordStore.delete(email)
      }
    }
  },
  60 * 60 * 1000
)

export const register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, fullName, phone, address } = req.body

    console.log('🔍 Registration attempt:', {
      username,
      email,
      fullName,
      phone,
      hasPassword: !!password,
      address
    })

    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })

    if (existingUser) {
      const errors: { [key: string]: string } = {}
      if (existingUser.email === email) {
        errors.email = 'Email is already in use'
      }
      if (existingUser.username === username) {
        errors.username = 'Username is already taken'
      }

      console.log('❌ User already exists:', errors)
      res.status(400).json({
        success: false,
        message: 'validation_error',
        errors
      })
      return
    }

    // Check if email is already in verification process
    if (verificationStore.has(email)) {
      res.status(400).json({
        success: false,
        message: 'Email is already in verification process'
      })
      return
    }

    // Process address
    let addresses: any[] = []
    if (address) {
      if (Array.isArray(address)) {
        // Validate each address object
        addresses = address
          .map((addr) => {
            if (typeof addr === 'object' && addr !== null) {
              return {
                recipientName: addr.recipientName || '',
                street: addr.street || '',
                city: addr.city || '',
                state: addr.state || '',
                country: addr.country || '',
                addressNumber: addr.addressNumber || '',
                isDefault: addr.isDefault || false
              }
            }
            return null
          })
          .filter((addr) => addr !== null)
      } else if (typeof address === 'string') {
        try {
          const parsed = JSON.parse(address)
          if (Array.isArray(parsed)) {
            addresses = parsed
              .map((addr) => {
                if (typeof addr === 'object' && addr !== null) {
                  return {
                    recipientName: addr.recipientName || '',
                    street: addr.street || '',
                    city: addr.city || '',
                    state: addr.state || '',
                    country: addr.country || '',
                    addressNumber: addr.addressNumber || '',
                    isDefault: addr.isDefault || false
                  }
                }
                return null
              })
              .filter((addr) => addr !== null)
          } else {
            console.log('❌ Invalid address format: not an array')
            res.status(400).json({
              success: false,
              message: 'validation_error',
              errors: { address: 'Address must be an array' }
            })
            return
          }
        } catch {
          console.log('❌ Invalid address JSON format')
          res.status(400).json({
            success: false,
            message: 'validation_error',
            errors: { address: 'Invalid address JSON format' }
          })
          return
        }
      } else {
        res.status(400).json({
          success: false,
          message: 'validation_error',
          errors: { address: 'Address must be an array or JSON string' }
        })
        return
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    console.log('✅ Generated verification code:', verificationCode)

    // Store verification data in memory
    verificationStore.set(email, {
      username,
      email,
      passwordHash: hashedPassword,
      fullName,
      phone,
      addresses,
      verificationCode,
      expiresAt
    })

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode)
      console.log('✅ Verification email sent successfully to:', email)
    } catch (emailError: any) {
      console.error('❌ Email sending failed:', {
        error: emailError.message,
        email: email
      })
      verificationStore.delete(email)
      res.status(500).json({
        success: false,
        message: 'Failed to send verification email',
        error: emailError.message || 'Unknown error occurred'
      })
      return
    }

    // Return success with pending status
    console.log('✅ Registration completed successfully:', { email, status: 'pending' })
    res.status(201).json({
      success: true,
      message: 'Registration successful, please check your email for verification',
      data: {
        email,
        status: 'pending',
        message: 'Please check your email for verification code'
      }
    })
  } catch (error: any) {
    console.error('❌ Registration error:', {
      message: error.message,
      stack: error.stack
    })
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message || 'Unknown error occurred'
    })
  }
}

export const verifyEmail: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code } = req.body

    if (!email || !code) {
      res.status(400).json({
        success: false,
        message: 'Missing email or code'
      })
      return
    }

    // Log the received code for debugging
    console.log('Received verification request:', { email, code })

    // Check both verification stores
    const registrationData = verificationStore.get(email);
    const emailChangeData = emailChangeStore.get(email);

    if (!registrationData && !emailChangeData) {
      console.log('No verification data found for email:', email);
      res.status(400).json({ 
        success: false, 
        message: 'Verification data not found or expired' 
      });
      return;
    }

    // Determine which store to use and handle type checking
    const isEmailChange = !!emailChangeData;
    const verificationData = isEmailChange ? emailChangeData : registrationData;

    if (!verificationData) {
      res.status(400).json({ 
        success: false, 
        message: 'Verification data not found or expired' 
      });
      return;
    }

    // Log the stored code for debugging
    console.log('Stored verification code:', verificationData.verificationCode)
    console.log('Code comparison:', {
      received: code,
      stored: verificationData.verificationCode,
      match: code === verificationData.verificationCode
    })

    if (verificationData.verificationCode !== code) {
      res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      })
      return
    }

    if (verificationData.expiresAt < new Date()) {
      console.log('Verification code expired for email:', email);
      if (isEmailChange) {
        emailChangeStore.delete(email);
      } else {
        verificationStore.delete(email);
      }
      res.status(400).json({ 
        success: false, 
        message: 'Verification code expired' 
      });
      return;
    }

    if (isEmailChange) {
      // Handle email change verification
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
        return;
      }

      // Update user's email
      user.email = email;
      await user.save();
      emailChangeStore.delete(email);

      // Generate new JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(200).json({
        success: true,
        message: 'Email updated successfully',
        data: {
          token,
          user: { 
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
          }
        }
      });
    } else {
      // Handle registration verification
      if (!registrationData) {
        res.status(400).json({ 
          success: false, 
          message: 'Registration data not found' 
        });
        return;
      }

      const user = new User({
        username: registrationData.username,
        email: registrationData.email,
        passwordHash: registrationData.passwordHash,
        fullName: registrationData.fullName,
        phone: registrationData.phone,
        addresses: registrationData.addresses,
        isVerified: true
      });

      await user.save();
      verificationStore.delete(email);

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      console.log('Email verification successful for:', email);

      res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        data: {
          token,
          user: { 
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
          }
        }
      });
    }
  } catch (error: any) {
    console.error('Email verification error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message || 'Unknown error occurred'
    })
  }
}

export const resendVerificationCode: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      res.status(400).json({ success: false, message: 'Email is required' })
      return
    }

    // Check both verification stores
    const registrationData = verificationStore.get(email);
    const emailChangeData = emailChangeStore.get(email);

    if (!registrationData && !emailChangeData) {
      res.status(400).json({
        success: false,
        message: 'No verification data found for this email'
      })
      return
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (emailChangeData) {
      // Handle email change verification resend
      emailChangeStore.set(email, {
        email,
        verificationCode,
        expiresAt
      });
    } else if (registrationData) {
      // Handle registration verification resend
      verificationStore.set(email, {
        ...registrationData,
        verificationCode,
        expiresAt
      });
    }

    try {
      await sendVerificationEmail(email, verificationCode)
    } catch (emailError: any) {
      console.error('Detailed email error in resend:', emailError)
      res.status(500).json({
        success: false,
        message: 'Failed to send verification email',
        error: emailError.message || 'Unknown error occurred'
      })
      return
    }

    res.json({
      success: true,
      message: 'New verification code sent successfully'
    })
  } catch (error: any) {
    console.error('Resend verification code error:', error)
    res.status(500).json({
      success: false,
      message: 'server_error',
      error: error.message || 'Unknown error occurred'
    })
  }
}

export const login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username: loginUsername, password: loginPassword } = req.body

    // Validate input
    if (!loginUsername || !loginPassword) {
      res.status(400).json({
        success: false,
        message: 'login.errors.requiredFields',
        errors: {
          username: !loginUsername ? 'Username is required' : undefined,
          password: !loginPassword ? 'Password is required' : undefined
        }
      })
      return
    }

    // Find user by username
    const user = await User.findOne({ username: loginUsername })

    // Check if user exists
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'login.errors.invalidCredentials'
      })
      return
    }

    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(loginPassword, user.passwordHash)

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'login.errors.invalidCredentials'
      })
      return
    }

    // Check if user is verified
    if (!user.isVerified) {
      res.status(403).json({
        success: false,
        message: 'login.errors.unverified'
      })
      return
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '10m' }
    )

    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      { expiresIn: '30d' }
    )
    user.refreshToken = refreshToken
    await user.save()

    // Return success response
    res.status(200).json({
      success: true,
      message: 'login.success',
      data: {
        token,
        refreshToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'login.errors.server'
    })
  }
}

export const handleGoogleCallback: RequestHandler = async (req, res) => {
  try {
    const { code } = req.query
    if (!code || typeof code !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Missing Google code'
      })
      return
    }

    // Get tokens from Google
    const { tokens } = await googleClient.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI
    })

    if (!tokens.id_token) {
      res.status(400).json({
        success: false,
        message: 'No ID token received from Google'
      })
      return
    }

    googleClient.setCredentials(tokens)

    // Verify token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    if (!payload || !payload.email) {
      res.status(400).json({
        success: false,
        message: 'Cannot verify Google token or missing email'
      })
      return
    }

    // Find or create user
    let user = await User.findOne({ email: payload.email })

    if (user && !user.googleId) {
      // Link Google account to existing user
      user.googleId = payload.sub
      await user.save()
    }

    if (!user) {
      // Generate unique username
      const username = payload.email.split('@')[0] + Math.random().toString(36).substring(2, 8)

      const existingUser = await User.findOne({ username })
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Username already exists'
        })
        return
      }

      // Create new user
      user = new User({
        username,
        email: payload.email,
        fullName: payload.name,
        passwordHash: '',
        role: 'user',
        googleId: payload.sub,
        isVerified: true // Google accounts are pre-verified
      })
      await user.save()
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '10m' }
    )

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`)
  } catch (error) {
    console.error('Google callback error:', error)
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`)
  }
}

export const handleFacebookCallback: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { code, state } = req.query

    // Validate state parameter
    if (!state || state !== req.session.state) {
      console.error('Invalid state parameter:', { received: state, expected: req.session.state })
      res.status(400).json({ message: 'Invalid state parameter' })
      return
    }

    // Clear state from session
    delete req.session.state

    // Validate code
    if (!code || typeof code !== 'string') {
      console.error('Missing or invalid code:', code)
      res.status(400).json({ message: 'Thiếu mã xác thực từ Facebook (code).' })
      return
    }

    // Lấy access_token từ Facebook
    let tokenResponse
    try {
      tokenResponse = await axios.get('https://graph.facebook.com/v12.0/oauth/access_token', {
        params: {
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
          code
        }
      })
    } catch (error: any) {
      console.error('Error getting access token:', error.response?.data || error.message)
      res.status(401).json({
        message: 'Không thể lấy access token từ Facebook.',
        error: error.response?.data || error.message
      })
      return
    }

    const { access_token } = tokenResponse.data
    if (!access_token) {
      console.error('No access token in response:', tokenResponse.data)
      res.status(401).json({ message: 'Không nhận được access token từ Facebook.' })
      return
    }

    // Lấy thông tin người dùng từ Facebook
    let userResponse
    try {
      userResponse = await axios.get('https://graph.facebook.com/me', {
        params: {
          fields: 'id,email,name,picture',
          access_token
        }
      })
    } catch (error: any) {
      console.error('Error getting user info:', error.response?.data || error.message)
      res.status(401).json({
        message: 'Không thể lấy thông tin người dùng từ Facebook.',
        error: error.response?.data || error.message
      })
      return
    }

    const { id: facebookId, email, name, picture } = userResponse.data

    if (!email) {
      console.error('No email in Facebook response:', userResponse.data)
      res.status(400).json({ message: 'Không lấy được email từ Facebook. Vui lòng cấp quyền email.' })
      return
    }

    // Tìm user trong MongoDB
    let user = await User.findOne({ email })

    if (!user) {
      // Tạo username tránh trùng
      const baseUsername = email.split('@')[0]
      let username = baseUsername
      let isUnique = false
      let counter = 1

      while (!isUnique) {
        const existing = await User.findOne({ username })
        if (!existing) {
          isUnique = true
        } else {
          username = `${baseUsername}${counter}`
          counter++
        }
      }

      // Tạo user mới
      user = new User({
        username,
        email,
        fullName: name,
        passwordHash: '', // không cần vì dùng OAuth
        role: 'USER',
        facebookId,
        avatar: picture?.data?.url // Lưu avatar từ Facebook
      })

      await user.save()
    } else {
      // Cập nhật thông tin nếu cần
      if (!user.facebookId) user.facebookId = facebookId
      if (!user.avatar && picture?.data?.url) user.avatar = picture.data.url
      if (!user.fullName) user.fullName = name
      await user.save()
    }

    // Tạo JWT trả về FE
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '10m' }
    )

    // Redirect về FE
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`)
    return
  } catch (error: any) {
    console.error('Facebook callback error:', error?.response?.data || error.message)
    res.status(500).json({
      message: 'Lỗi khi xử lý đăng nhập bằng Facebook.',
      error: error?.response?.data || error.message
    })
    return
  }
}

export const logout: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Clear JWT token cookie if it exists
    res.clearCookie('token')

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err)
        res.status(500).json({
          success: false,
          message: 'Failed to logout'
        })
      } else {
        // Clear all cookies
        const cookies = req.cookies
        for (const cookieName in cookies) {
          res.clearCookie(cookieName)
        }

        res.status(200).json({
          success: true,
          message: 'Logout successful'
        })
      }
    })
  } catch (error: any) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

export const forgotPassword: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required'
      })
      return
    }

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'No account found with this email'
      })
      return
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP
    resetPasswordStore.set(email, {
      email,
      otp,
      expiresAt
    })

    // Send reset password email
    try {
      await sendResetPasswordEmail(email, otp)
      res.status(200).json({
        success: true,
        message: 'Password reset OTP sent successfully'
      })
    } catch (error) {
      console.error('Failed to send reset password email:', error)
      resetPasswordStore.delete(email)
      res.status(500).json({
        success: false,
        message: 'Failed to send reset password email'
      })
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

export const verifyOTP: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      })
      return
    }

    const resetData = resetPasswordStore.get(email)
    if (!resetData) {
      res.status(400).json({
        success: false,
        message: 'No reset request found for this email'
      })
      return
    }

    if (resetData.expiresAt < new Date()) {
      resetPasswordStore.delete(email)
      res.status(400).json({
        success: false,
        message: 'OTP has expired'
      })
      return
    }

    if (resetData.otp !== otp) {
      res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      })
      return
    }

    // Generate a temporary token for password reset
    const token = jwt.sign({ email, purpose: 'password_reset' }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '10m'
    })

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: { token }
    })
  } catch (error) {
    console.error('Verify reset OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

export const resetPassword: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      })
      return
    }

    // Verify token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
        email: string
        purpose: string
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      })
      return
    }

    if (decoded.purpose !== 'password_reset') {
      res.status(400).json({
        success: false,
        message: 'Invalid token purpose'
      })
      return
    }

    // Find user
    const user = await User.findOne({ email: decoded.email })
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      })
      return
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update password
    user.passwordHash = hashedPassword
    await user.save()

    // Clear reset data
    resetPasswordStore.delete(decoded.email)

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
};

export const sendEmailChangeVerification: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required'
      });
      return;
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Email is already in use'
      });
      return;
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store verification data
    emailChangeStore.set(email, {
      email,
      verificationCode,
      expiresAt
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode);
      console.log('✅ Email change verification code sent successfully to:', email);
    } catch (emailError: any) {
      console.error('❌ Email sending failed:', {
        error: emailError.message,
        email: email
      });
      emailChangeStore.delete(email);
      res.status(500).json({
        success: false,
        message: 'Failed to send verification email',
        error: emailError.message || 'Unknown error occurred'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Verification code sent successfully',
      data: {
        email,
        status: 'pending',
        message: 'Please check your email for verification code'
      }
    });
  } catch (error: any) {
    console.error('Send email change verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message || 'Unknown error occurred'
    });
  }
};

export const refreshToken: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      res.status(400).json({ message: 'Missing refresh token' })
      return
    }
    let decoded: any
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key')
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired refresh token' })
      return
    }
    const user = await User.findOne({ _id: decoded.id, refreshToken })
    if (!user) {
      res.status(401).json({ message: 'Invalid refresh token' })
      return
    }
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '10m' }
    )
    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: 'Error refreshing token' })
  }
}

export const changePassword: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      })
      return
    }

    // Find user
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      })
      return
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      })
      return
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update password
    user.passwordHash = hashedPassword
    await user.save()

    res.json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.error('Error changing password:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    })
  }
}
