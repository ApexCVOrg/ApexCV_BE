import { Request, Response, RequestHandler } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { OAuth2Client } from 'google-auth-library'
import axios from 'axios'
import { sendVerificationEmail } from '../services/email.service'
import dotenv from 'dotenv'
dotenv.config()

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

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

setInterval(() => {
  const now = new Date()
  for (const [email, data] of verificationStore.entries()) {
    if (data.expiresAt < now) {
      verificationStore.delete(email)
    }
  }
}, 60 * 60 * 1000)

export const register: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    if (verificationStore.has(email)) {
      res.status(400).json({
        success: false,
        message: 'Email is already in verification process'
      })
      return
    }

    let addresses: any[] = []
    if (address) {
      if (Array.isArray(address)) {
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

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    console.log('✅ Generated verification code:', verificationCode)

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

    try {
      await sendVerificationEmail(email, verificationCode)
      console.log('✅ Verification email sent successfully to:', email)
    } catch (emailError: unknown) {
      if (emailError instanceof Error) {
        console.error('❌ Email sending failed:', {
          error: emailError.message,
          email
        })
        verificationStore.delete(email)
        res.status(500).json({
          success: false,
          message: 'Failed to send verification email',
          error: emailError.message || 'Unknown error occurred'
        })
      }
      return
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful, please check your email for verification',
      data: {
        email,
        status: 'pending',
        message: 'Please check your email for verification code'
      }
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
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
}