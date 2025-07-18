import express from 'express'
import { getAllVouchers, applyVoucher } from '../controllers/voucher.controller';

const router = express.Router()

// GET /api/voucher
router.get('/', getAllVouchers);
// POST /api/voucher/apply
router.post('/apply', applyVoucher);

export default router 