import express from 'express';
import { register, login, handleGoogleCallback, handleFacebookCallback } from '../controllers/auth.controller';

const router = express.Router();

// Route đăng ký
router.post('/register', register);

// Route đăng nhập
router.post('/login', login);

// OAuth callback Google
router.get('/login/oauth2/code/google', handleGoogleCallback);

// OAuth callback Facebook
router.get('/login/oauth2/code/facebook', handleFacebookCallback);

export default router;
