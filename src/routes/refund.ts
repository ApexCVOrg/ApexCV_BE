import express from 'express';
import {
  createRefundRequest,
  getMyRefundRequests,
  getAllRefundRequests,
  acceptRefundRequest,
  rejectRefundRequest,
  getRefundHistoryByOrder,
} from '../controllers/refund.controller';
import { authenticateToken } from '../middlewares/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Multer config giống upload.ts
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('File type not allowed'), false);
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 3 }
});

// User gửi yêu cầu refund (có upload ảnh)
router.post('/request', authenticateToken, upload.array('images', 3), createRefundRequest);
// User xem lịch sử refund
router.get('/my-requests', authenticateToken, getMyRefundRequests);
// Manager xem danh sách refund
router.get('/requests', authenticateToken, getAllRefundRequests);
// Manager accept
router.post('/accept/:id', authenticateToken, acceptRefundRequest);
// Manager reject
router.post('/reject/:id', authenticateToken, rejectRefundRequest);
// Lấy lịch sử refund cho 1 order cụ thể
router.get('/history', authenticateToken, getRefundHistoryByOrder);

export default router; 