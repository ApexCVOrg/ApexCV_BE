import express from 'express';
import { register, login, handleGoogleCallback, handleFacebookCallback } from '../controllers/auth.controller';
import { authenticateToken, isAdmin, isUser } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/google/callback', handleGoogleCallback);
router.get('/facebook/callback', handleFacebookCallback);

// Protected routes
router.get('/profile', authenticateToken, isUser, (req, res) => {
  res.json({ user: req.user });
});

router.get('/admin', authenticateToken, isAdmin, (req, res) => {
  res.json({ message: 'Admin access granted' });
});

export default router;
