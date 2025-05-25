import express, { Request, Response, Router } from "express";
import { Conversation } from "../models/Conversation";

const router: Router = express.Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const conversations = await Conversation.find().populate("participants");
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách cuộc trò chuyện: " + (error as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const conversation = await Conversation.findById(req.params.id).populate("participants");
    if (!conversation) {
      res.status(404).json({ message: "Không tìm thấy cuộc trò chuyện" });
      return;
    }
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin cuộc trò chuyện: " + (error as Error).message });
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const conversation = new Conversation(req.body);
    const savedConversation = await conversation.save();
    res.status(201).json(savedConversation);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo cuộc trò chuyện: " + (error as Error).message });
  }
});

router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!conversation) {
      res.status(404).json({ message: "Không tìm thấy cuộc trò chuyện" });
      return;
    }
    res.json(conversation);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật cuộc trò chuyện: " + (error as Error).message });
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const conversation = await Conversation.findByIdAndDelete(req.params.id);
    if (!conversation) {
      res.status(404).json({ message: "Không tìm thấy cuộc trò chuyện" });
      return;
    }
    res.json({ message: "Đã xóa cuộc trò chuyện thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa cuộc trò chuyện: " + (error as Error).message });
  }
});

export default router;
