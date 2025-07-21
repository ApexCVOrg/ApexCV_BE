
import express from 'express';
import { createCheckoutSession } from '../controllers/checkout.controller';

const router = express.Router();

// Create checkout session
router.post('/create-session', createCheckoutSession);

export default router; 