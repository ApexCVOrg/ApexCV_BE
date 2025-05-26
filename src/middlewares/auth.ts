import { Request, Response } from 'express';

// Giả sử bạn có service hoặc model để xử lý auth, ví dụ userService
// import userService from '../services/userService';

// Hàm đăng ký user (ví dụ đơn giản)
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // TODO: validate, hash password, lưu user vào DB

    return res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Hàm đăng nhập user (ví dụ đơn giản)
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // TODO: kiểm tra user, so sánh password, tạo JWT

    return res.status(200).json({ message: 'Đăng nhập thành công', token: 'jwt-token-example' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Callback OAuth Google
export const handleGoogleCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ message: 'Thiếu mã code từ Google' });
    }

    // TODO: Dùng code lấy access token Google, lấy profile user
    // TODO: Tạo hoặc cập nhật user trong DB, tạo JWT

    return res.status(200).json({ message: 'Xử lý callback Google thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi xử lý callback Google', error });
  }
};

// Callback OAuth Facebook
export const handleFacebookCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ message: 'Thiếu mã code từ Facebook' });
    }

    // TODO: Dùng code lấy access token Facebook, lấy profile user
    // TODO: Tạo hoặc cập nhật user trong DB, tạo JWT

    return res.status(200).json({ message: 'Xử lý callback Facebook thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi xử lý callback Facebook', error });
  }
};
