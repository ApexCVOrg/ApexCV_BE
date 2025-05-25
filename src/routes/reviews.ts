import express, { Request, Response, Router } from "express";
import { Review } from "../models/Review";

const router: Router = express.Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find().populate("user product");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách đánh giá: " + (error as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id).populate("user product");
    if (!review) {
      res.status(404).json({ message: "Không tìm thấy đánh giá" });
      return;
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin đánh giá: " + (error as Error).message });
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const review = new Review(req.body);
    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo đánh giá: " + (error as Error).message });
  }
});

router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) {
      res.status(404).json({ message: "Không tìm thấy đánh giá" });
      return;
    }
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật đánh giá: " + (error as Error).message });
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      res.status(404).json({ message: "Không tìm thấy đánh giá" });
      return;
    }
    res.json({ message: "Đã xóa đánh giá thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa đánh giá: " + (error as Error).message });
  }
});

export default router;
