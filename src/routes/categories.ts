import express, { Request, Response, Router } from "express";
import { Category } from "../models/Category";

const router: Router = express.Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách category: " + (error as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({ message: "Không tìm thấy category" });
      return;
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin category: " + (error as Error).message });
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo category: " + (error as Error).message });
  }
});

router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      res.status(404).json({ message: "Không tìm thấy category" });
      return;
    }
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật category: " + (error as Error).message });
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      res.status(404).json({ message: "Không tìm thấy category" });
      return;
    }
    res.json({ message: "Đã xóa category thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa category: " + (error as Error).message });
  }
});

export default router;
