import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName, phone, address } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email đã được sử dụng' });
      return;
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const user = new User({
      email,
      password: hashedPassword,
      fullName,
      phone,
      address,
      role: 'USER'
    });

    // Lưu user vào database
    const savedUser = await user.save();

    // Tạo JWT token
    const token = jwt.sign(
      { 
        id: savedUser._id,
        email: savedUser.email,
        role: savedUser.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Trả về thông tin user và token
    res.status(201).json({
      message: 'Đăng ký thành công',
      user: {
        id: savedUser._id,
        email: savedUser.email,
        fullName: savedUser.fullName,
        role: savedUser.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi khi đăng ký: ' + (error as Error).message 
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
      return;
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
      return;
    }

    // Tạo JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Trả về thông tin user và token
    res.json({
      message: 'Đăng nhập thành công',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi khi đăng nhập: ' + (error as Error).message 
    });
  }
};

export const handleGoogleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      res.status(400).json({ message: 'Thiếu mã code từ Google' });
      return;
    }

    // Lấy token từ Google
    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);

    // Lấy thông tin user từ Google
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();

    if (!payload) {
      res.status(400).json({ message: 'Không thể xác thực thông tin từ Google' });
      return;
    }

    // Tìm hoặc tạo user mới
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = new User({
        email: payload.email,
        fullName: payload.name,
        password: '', // Không cần password cho OAuth
        role: 'USER',
        googleId: payload.sub
      });
      await user.save();
    }

    // Tạo JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Đăng nhập Google thành công',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi xử lý callback Google: ' + (error as Error).message 
    });
  }
};

export const handleFacebookCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      res.status(400).json({ message: 'Thiếu mã code từ Facebook' });
      return;
    }

    // Lấy access token từ Facebook
    const tokenResponse = await axios.get('https://graph.facebook.com/v12.0/oauth/access_token', {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
        code
      }
    });

    const { access_token } = tokenResponse.data;

    // Lấy thông tin user từ Facebook
    const userResponse = await axios.get('https://graph.facebook.com/me', {
      params: {
        fields: 'id,email,name',
        access_token
      }
    });

    const { id, email, name } = userResponse.data;

    // Tìm hoặc tạo user mới
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        fullName: name,
        password: '', // Không cần password cho OAuth
        role: 'USER',
        facebookId: id
      });
      await user.save();
    }

    // Tạo JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Đăng nhập Facebook thành công',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi xử lý callback Facebook: ' + (error as Error).message 
    });
  }
}; 