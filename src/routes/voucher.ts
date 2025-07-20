import express from 'express'
import { getAllCoupons, applyCoupon } from '../controllers/voucher.controller';

const router = express.Router()

// GET /api/coupon
router.get('/', getAllCoupons);
// POST /api/coupon/apply
router.post('/apply', applyCoupon);

export default router 