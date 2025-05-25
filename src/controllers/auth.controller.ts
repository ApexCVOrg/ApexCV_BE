import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

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