import express, { Request, Response, Router } from "express";
import { User } from "../models/User";
import { authenticateToken, isUser } from "../middlewares/auth";

const router: Router = express.Router();

// Apply authentication middleware to profile routes
router.use(authenticateToken, isUser);

// Profile management
router.get("/profile", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile: " + (error as Error).message });
  }
});

router.put("/update-profile", async (req: Request, res: Response) => {
  try {
    const { fullName, phone, avatar, addresses } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, phone, avatar, addresses },
      { new: true }
    ).select('-passwordHash');
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Error updating profile: " + (error as Error).message });
  }
});

router.put("/change-password", async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    // TODO: Implement password change logic
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error changing password: " + (error as Error).message });
  }
});

// Lấy danh sách tất cả người dùng
router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng: " + (error as Error).message });
  }
});

// Lấy thông tin người dùng theo ID
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "Không tìm thấy người dùng" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng: " + (error as Error).message });
  }
});

// Tạo người dùng mới
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      username,
      email,
      passwordHash,
      fullName,
      phone,
      role,
      status,
      avatar,
      addresses,
    } = req.body;

    if (!username || !email || !passwordHash) {
      res.status(400).json({ message: "username, email và passwordHash là bắt buộc" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email đã được đăng ký" });
      return;
    }

    const user = new User({
      username,
      email,
      passwordHash,
      fullName,
      phone,
      role,
      status,
      avatar,
      addresses,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo người dùng: " + (error as Error).message });
  }
});

// Cập nhật người dùng
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const updateData = req.body;

    // Không cho cập nhật email trùng
    if (updateData.email) {
      const existingUser = await User.findOne({ email: updateData.email, _id: { $ne: req.params.id } });
      if (existingUser) {
        res.status(400).json({ message: "Email đã được đăng ký bởi người dùng khác" });
        return;
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) {
      res.status(404).json({ message: "Không tìm thấy người dùng" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật người dùng: " + (error as Error).message });
  }
});

// Xóa người dùng
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: "Không tìm thấy người dùng" });
      return;
    }
    res.json({ message: "Đã xóa người dùng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa người dùng: " + (error as Error).message });
  }
});

export default router;
