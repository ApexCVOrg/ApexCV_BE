import { Request, Response, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { PendingUser } from '../models/PendingUser';
import { sendVerificationEmail } from '../services/email.service';
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
export const register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, fullName, phone, address } = req.body;

    console.log('🔍 Registration attempt:', { 
      username, 
      email, 
      fullName, 
      phone,
      hasPassword: !!password,
      address 
    });

    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    const existingPendingUser = await PendingUser.findOne({ $or: [{ email }, { username }] });

    if (existingUser || existingPendingUser) {
      const errors: { [key: string]: string } = {};
      if (existingUser?.email === email || existingPendingUser?.email === email) {
        errors.email = 'Email is already in use';
      }
      if (existingUser?.username === username || existingPendingUser?.username === username) {
        errors.username = 'Username is already taken';
      }
      
      console.log('❌ User already exists:', errors);
      res.status(400).json({
        success: false,
        message: 'validation_error',
        errors
      });
      return;
    }

    // Process address
    let addresses: any[] = [];
    if (address) {
      if (Array.isArray(address)) {
        // Validate each address object
        addresses = address.map(addr => {
          if (typeof addr === 'object' && addr !== null) {
            return {
              recipientName: addr.recipientName || '',
              street: addr.street || '',
              city: addr.city || '',
              state: addr.state || '',
              country: addr.country || '',
              addressNumber: addr.addressNumber || '',
              isDefault: addr.isDefault || false
            };
          }
          return null;
        }).filter(addr => addr !== null);
      } else if (typeof address === 'string') {
        try {
          const parsed = JSON.parse(address);
          if (Array.isArray(parsed)) {
            addresses = parsed.map(addr => {
              if (typeof addr === 'object' && addr !== null) {
                return {
                  recipientName: addr.recipientName || '',
                  street: addr.street || '',
                  city: addr.city || '',
                  state: addr.state || '',
                  country: addr.country || '',
                  addressNumber: addr.addressNumber || '',
                  isDefault: addr.isDefault || false
                };
              }
              return null;
            }).filter(addr => addr !== null);
          } else {
            console.log('❌ Invalid address format: not an array');
            res.status(400).json({
              success: false,
              message: 'validation_error',
              errors: { address: 'Address must be an array' }
            });
            return;
          }
        } catch {
          console.log('❌ Invalid address JSON format');
          res.status(400).json({
            success: false,
            message: 'validation_error',
            errors: { address: 'Invalid address JSON format' }
          });
          return;
        }
      } else {
        console.log('❌ Invalid address type:', typeof address);
        res.status(400).json({
          success: false,
          message: 'validation_error',
          errors: { address: 'Address must be an array or JSON string' }
        });
        return;
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log('✅ Generated verification code:', verificationCode);

    // Save to pending users
    const pendingUser = new PendingUser({
      username,
      email,
      passwordHash: hashedPassword,
      fullName,
      phone,
      addresses,
      verificationCode,
      expiresAt,
    });

    await pendingUser.save();
    console.log('✅ Saved pending user:', { email, username });

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode);
      console.log('✅ Verification email sent successfully to:', email);
    } catch (emailError: any) {
      console.error('❌ Email sending failed:', {
        error: emailError.message,
        email: email
      });
      await PendingUser.deleteOne({ email });
      res.status(500).json({
        success: false,
        message: 'Failed to send verification email',
        error: emailError.message || 'Unknown error occurred'
      });
      return;
    }

    // Return success with pending status
    console.log('✅ Registration completed successfully:', { email, status: 'pending' });
    res.status(201).json({
      success: true,
      message: 'Registration successful, please check your email for verification',
      data: {
        email,
        status: 'pending',
        message: 'Please check your email for verification code'
      }
    });
  } catch (error: any) {
    console.error('❌ Registration error:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message || 'Unknown error occurred'
    });
  }
};
export const resendVerificationCode: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Email is required' });
      return;
    }

    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      res.status(400).json({
        success: false,
        message: 'No pending registration found for this email',
      });
      return;
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    pendingUser.verificationCode = verificationCode;
    pendingUser.expiresAt = expiresAt;
    await pendingUser.save();

    try {
      await sendVerificationEmail(email, verificationCode);
    } catch (emailError: any) {
      console.error('Detailed email error in resend:', emailError);
      res.status(500).json({
        success: false,
        message: 'Failed to send verification email',
        error: emailError.message || 'Unknown error occurred',
      });
      return;
    }

    res.json({
      success: true,
      message: 'New verification code sent successfully',
    });
  } catch (error: any) {
    console.error('Resend verification code error:', error);
    res.status(500).json({
      success: false,
      message: 'server_error',
      error: error.message || 'Unknown error occurred',
    });
  }
};
export const verifyEmail: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({ 
        success: false, 
        message: 'Missing email or code' 
      });
      return;
    }

    // Log the received code for debugging
    console.log('Received verification request:', { email, code });

    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      console.log('No pending user found for email:', email);
      res.status(400).json({ 
        success: false, 
        message: 'User not found or already verified' 
      });
      return;
    }

    // Log the stored code for debugging
    console.log('Stored verification code:', pendingUser.verificationCode);
    console.log('Code comparison:', {
      received: code,
      stored: pendingUser.verificationCode,
      match: code === pendingUser.verificationCode
    });

    if (pendingUser.verificationCode !== code) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid verification code' 
      });
      return;
    }

    if (pendingUser.expiresAt < new Date()) {
      console.log('Verification code expired for email:', email);
      await PendingUser.deleteOne({ email });
      res.status(400).json({ 
        success: false, 
        message: 'Verification code expired' 
      });
      return;
    }

    // Create new user
    const user = new User({
      username: pendingUser.username,
      email: pendingUser.email,
      passwordHash: pendingUser.passwordHash,
      fullName: pendingUser.fullName,
      phone: pendingUser.phone,
      addresses: pendingUser.addresses,
    });

    await user.save();
    await PendingUser.deleteOne({ email });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('Email verification successful for:', email);

    res.status(201).json({
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
  } catch (error: any) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message || 'Unknown error occurred'
    });
  }
};
// Tương tự với login, handleGoogleCallback, handleFacebookCallback

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    if (!user.passwordHash) {
      res.status(400).json({ message: 'Please login with your social account' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role },
      token,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Login error: ' + (error as Error).message });
    return;
  }
};

export const handleGoogleCallback: RequestHandler = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      res.status(400).json({ message: 'Missing Google code' });
      return;
    }

    // Đảm bảo redirect_uri khớp với frontend
    const { tokens } = await googleClient.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI, // Phải khớp với frontend
    });

    if (!tokens.id_token) {
      res.status(400).json({ message: 'No ID token received from Google' });
      return;
    }

    googleClient.setCredentials(tokens);

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ message: 'Cannot verify Google token or missing email' });
      return;
    }

    // Tìm hoặc tạo user
    let user = await User.findOne({ email: payload.email });
    
    if (user && !user.googleId) {
      user.googleId = payload.sub;
      await user.save();
    }
    
    if (!user) {
      const username = payload.email.split('@')[0] + Math.random().toString(36).substring(2, 8);
      
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res.status(400).json({ message: 'Username already exists' });
        return;
      }

      user = new User({
        username,
        email: payload.email,
        fullName: payload.name,
        passwordHash: '',
        role: 'user',
        googleId: payload.sub,
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Redirect về trang success với token
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    return;
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
    return;
  }
};

export const handleFacebookCallback: RequestHandler = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      res.status(400).json({ message: 'Missing Facebook code' });
      return;
    }

    const tokenResponse = await axios.get('https://graph.facebook.com/v12.0/oauth/access_token', {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
        code,
      },
    });

    const { access_token } = tokenResponse.data;

    const userResponse = await axios.get('https://graph.facebook.com/me', {
      params: {
        fields: 'id,email,name',
        access_token,
      },
    });

    const { id, email, name } = userResponse.data;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      // Generate username from email
      const username = email.split('@')[0] + Math.random().toString(36).substring(2, 8);
      
      // Check if username exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res.status(400).json({ message: 'Username already exists' });
        return;
      }

      user = new User({
        username,
        email,
        fullName: name,
        passwordHash: '', // OAuth users don't need password
        role: 'USER',
        facebookId: id,
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    return;
  } catch (error) {
    console.error('Facebook callback error:', error);
    res.status(500).json({ message: 'Facebook callback error: ' + (error as Error).message });
    return;
  }
  
};
