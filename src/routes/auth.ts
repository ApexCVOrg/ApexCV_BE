import express, { Router } from 'express'
import {
  register,
  login,
  handleGoogleCallback,
  handleFacebookCallback,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  verifyOTP,
  resetPassword,
  logout,
  refreshToken,
  sendEmailChangeVerification
} from '../controllers/auth.controller'
import { authenticateToken, isAdmin, isUser, checkInactivity } from '../middlewares/auth'
import { validateRegister } from '../middlewares/validation'
import { OAuth2Client } from 'google-auth-library'

const router: Router = express.Router()

// Public routes
router.post('/register', validateRegister, register);
router.post('/verify-email', authenticateToken, verifyEmail);
router.post('/send-email-change-verification', authenticateToken, sendEmailChangeVerification);
router.post('/resend-verification', resendVerificationCode);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/login', login);
router.post('/register', validateRegister, register)
router.post('/verify-email', verifyEmail)
router.post('/resend-verification', resendVerificationCode)
router.post('/forgot-password', forgotPassword)
router.post('/verify-otp', verifyOTP)
router.post('/reset-password', resetPassword)
router.post('/login', login)

// Google OAuth routes
router.get('/google', (req, res) => {
  const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  const url = googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    redirect_uri: process.env.GOOGLE_REDIRECT_URI // ✅ thêm dòng này
  })

  res.redirect(url)
})

router.get('/google/callback', handleGoogleCallback)

// Facebook OAuth routes
router.get('/facebook', (req, res) => {
  const state = Math.random().toString(36).substring(7)
  req.session.state = state

  const facebookAuthUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&scope=email,public_profile&state=${state}`
  res.redirect(facebookAuthUrl)
})
router.get('/facebook/callback', handleFacebookCallback)

// Password management
router.post('/forgot-password', async (req, res) => {
  try {
    // TODO: Implement forgot password
    res.json({ message: 'Password reset instructions sent' })
  } catch (error) {
    res.status(500).json({ message: 'Error processing forgot password request: ' + (error as Error).message })
  }
})

router.post('/reset-password', async (req, res) => {
  try {
    // TODO: Implement reset password
    res.json({ message: 'Password reset successful' })
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password: ' + (error as Error).message })
  }
})

// Token management
router.post('/refresh-token', refreshToken)

router.post('/logout', authenticateToken, logout)

// Protected routes
router.get('/profile', authenticateToken, checkInactivity, isUser, (req, res) => {
  res.json({ user: req.user })
})

router.get('/admin', authenticateToken, checkInactivity, isAdmin, (req, res) => {
  res.json({ message: 'Admin access granted' })
})

export default router
