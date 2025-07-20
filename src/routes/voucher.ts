import express from 'express'
import { getAllVouchers, applyVoucher } from '../controllers/voucher.controller';
import { authenticateToken } from '../middlewares/auth'

const router = express.Router()

// GET /api/voucher
router.get('/', getAllVouchers);
// POST /api/voucher/apply
router.post('/apply', authenticateToken, applyVoucher);

export default router 