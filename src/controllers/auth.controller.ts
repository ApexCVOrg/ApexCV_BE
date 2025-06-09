import { Request, Response, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { PendingUser } from '../models/PendingUser';
import { sendVerificationEmail } from '../services/email.service';
import dotenv from 'dotenv';
dotenv.config();

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

    const { tokens } = await googleClient.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
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

    let user = await User.findOne({ email: payload.email });

    if (user) {
      // Gán googleId và avatarUrl nếu chưa có
      if (!user.googleId) user.googleId = payload.sub;
      if (!user.avatar && payload.picture) user.avatar = payload.picture;
      await user.save();
    } else {
      // Tạo user mới
      const baseUsername = payload.email.split('@')[0];
      const username = baseUsername

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
        avatar: payload.picture, // 👈 Lưu ảnh Google avatar
      });

      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
};

export const handleFacebookCallback: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { code, state } = req.query;

    // Validate state parameter
    if (!state || state !== req.session.state) {
      console.error('Invalid state parameter:', { received: state, expected: req.session.state });
      res.status(400).json({ message: 'Invalid state parameter' });
      return;
    }

    // Clear state from session
    delete req.session.state;

    // Validate code
    if (!code || typeof code !== 'string') {
      console.error('Missing or invalid code:', code);
      res.status(400).json({ message: 'Thiếu mã xác thực từ Facebook (code).' });
      return;
    }

    // Lấy access_token từ Facebook
    let tokenResponse;
    try {
      tokenResponse = await axios.get('https://graph.facebook.com/v12.0/oauth/access_token', {
        params: {
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
          code,
        },
      });
    } catch (error: any) {
      console.error('Error getting access token:', error.response?.data || error.message);
      res.status(401).json({ 
        message: 'Không thể lấy access token từ Facebook.',
        error: error.response?.data || error.message 
      });
      return;
    }

    const { access_token } = tokenResponse.data;
    if (!access_token) {
      console.error('No access token in response:', tokenResponse.data);
      res.status(401).json({ message: 'Không nhận được access token từ Facebook.' });
      return;
    }

    // Lấy thông tin người dùng từ Facebook
    let userResponse;
    try {
      userResponse = await axios.get('https://graph.facebook.com/me', {
        params: {
          fields: 'id,email,name,picture',
          access_token,
        },
      });
    } catch (error: any) {
      console.error('Error getting user info:', error.response?.data || error.message);
      res.status(401).json({ 
        message: 'Không thể lấy thông tin người dùng từ Facebook.',
        error: error.response?.data || error.message 
      });
      return;
    }

    const { id: facebookId, email, name, picture } = userResponse.data;

    if (!email) {
      console.error('No email in Facebook response:', userResponse.data);
      res.status(400).json({ message: 'Không lấy được email từ Facebook. Vui lòng cấp quyền email.' });
      return;
    }

    // Tìm user trong MongoDB
    let user = await User.findOne({ email });

    if (!user) {
      // Tạo username tránh trùng
      let baseUsername = email.split('@')[0];
      let username = baseUsername;
      let isUnique = false;
      let counter = 1;

      while (!isUnique) {
        const existing = await User.findOne({ username });
        if (!existing) {
          isUnique = true;
        } else {
          username = `${baseUsername}${counter}`;
          counter++;
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
        avatar: picture?.data?.url, // Lưu avatar từ Facebook
      });

      await user.save();
    } else {
      // Cập nhật thông tin nếu cần
      if (!user.facebookId) user.facebookId = facebookId;
      if (!user.avatar && picture?.data?.url) user.avatar = picture.data.url;
      if (!user.fullName) user.fullName = name;
      await user.save();
    }

    // Tạo JWT trả về FE
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Redirect về FE
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    return;
  } catch (error: any) {
    console.error('Facebook callback error:', error?.response?.data || error.message);
    res.status(500).json({
      message: 'Lỗi khi xử lý đăng nhập bằng Facebook.',
      error: error?.response?.data || error.message,
    });
    return;
  }
};
