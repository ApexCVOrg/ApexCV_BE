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
  sendOTP,
  saveAddress,
  sendEmailChangeVerification,
  changePassword
} from '../controllers/auth.controller'
import { authenticateToken, isAdmin, isUser, checkInactivity } from '../middlewares/auth'
import { validateRegister } from '../middlewares/validation'
import { OAuth2Client } from 'google-auth-library'

const router: Router = express.Router()

// Public routes
router.post('/register', validateRegister, register)
router.post('/login', login)
router.post('/send-otp', sendOTP)
router.post('/verify-email', verifyEmail)
router.post('/resend-verification', resendVerificationCode)
router.post('/save-address', saveAddress)
router.post('/forgot-password', forgotPassword)
router.post('/verify-otp', verifyOTP)
router.post('/reset-password', resetPassword)

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
    redirect_uri: process.env.GOOGLE_REDIRECT_URI
  })

  res.redirect(url)
})

router.get('/google/callback', handleGoogleCallback)

// Facebook OAuth routes
router.get('/facebook', (req, res) => {
  const state = Math.random().toString(36).substring(7)
  ;(req.session as { state?: string }).state = state

  const facebookAuthUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&scope=email,public_profile&state=${state}`
  res.redirect(facebookAuthUrl)
})
router.get('/facebook/callback', handleFacebookCallback)

// Token management
router.post('/refresh-token', refreshToken)
router.post('/logout', authenticateToken, logout)

// Protected routes
router.post('/send-email-change-verification', authenticateToken, sendEmailChangeVerification)
router.post('/change-password', authenticateToken, changePassword)

router.get('/profile', authenticateToken, checkInactivity, isUser, (req, res) => {
  res.json({ user: req.user })
})

router.get('/admin', authenticateToken, checkInactivity, isAdmin, (req, res) => {
  res.json({ message: 'Admin access granted' })
})

export default router
