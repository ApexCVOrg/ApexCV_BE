import { Router, Request, Response } from 'express';
import { suggestionsService } from '../services/suggestionsService';

const router = Router();

/**
 * GET /api/suggestions
 * Query params:
 * - path: string (optional) - Path phân cấp, ví dụ: "Tôi muốn mua sản phẩm|Tôi muốn mua sản phẩm cho Nam"
 * 
 * Response:
 * - Nếu path rỗng: trả về suggestions của các node cấp 1
 * - Nếu có path: trả về suggestions (children) của node tương ứng
 * - Nếu path không tồn tại: trả về 404
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const { path = "" } = req.query;
    
    // Validate path parameter
    if (typeof path !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Path parameter must be a string'
      });
    }

    // Lấy suggestions từ service
    const result = suggestionsService.getSuggestions(path);
    
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    if (error instanceof Error && error.message === 'Path not found') {
      return res.status(404).json({
        success: false,
        message: 'Path not found'
      });
    }

    console.error('Suggestions API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/suggestions/tree (debug endpoint)
 * Trả về toàn bộ cây để debug
 */
router.get('/tree', (_req: Request, res: Response) => {
  try {
    const tree = suggestionsService.getTree();
    res.json({
      success: true,
      data: {
        tree,
        totalNodes: tree.length
      }
    });
  } catch (error) {
    console.error('Tree API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 