import { Router, Request, Response } from 'express';
import { DocumentModel } from '../models/Document';

const router = Router();

/**
 * POST /api/chat
 * Body: { message: string }
 * Response: { reply: string, suggestions?: string[] }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Message is required and must be a string'
      });
    }

    // Tìm kiếm trong documents dựa trên message
    const searchQuery = {
      $text: { $search: message }
    };

    const documents = await DocumentModel.find(searchQuery, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .limit(3);

    let reply = '';
    let suggestions: string[] = [];

    if (documents.length > 0) {
      // Lấy document có điểm cao nhất
      const bestMatch = documents[0];
      reply = bestMatch.content;

      // Tạo suggestions từ các documents khác
      if (documents.length > 1) {
        suggestions = documents.slice(1).map((doc: any) => doc.title);
      }
    } else {
      // Fallback response khi không tìm thấy
      reply = 'Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể thử hỏi về sản phẩm, danh mục, hoặc chính sách của chúng tôi.';
      
      // Gợi ý các chủ đề chung
      suggestions = [
        'Tôi muốn mua sản phẩm',
        'Chính sách đổi trả',
        'Phương thức thanh toán',
        'Thông tin vận chuyển'
      ];
    }

    res.json({
      success: true,
      data: {
        reply,
        suggestions
      }
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 