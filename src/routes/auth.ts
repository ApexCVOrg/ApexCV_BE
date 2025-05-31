import express from 'express';
import { register, login, handleGoogleCallback, handleFacebookCallback } from '../controllers/auth.controller';
import { authenticateToken, isAdmin, isUser } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/google/callback', handleGoogleCallback);
router.get('/facebook/callback', handleFacebookCallback);

// Password management
router.post('/forgot-password', async (req, res) => {
  try {
    // TODO: Implement forgot password
    res.json({ message: 'Password reset instructions sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing forgot password request: ' + (error as Error).message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    // TODO: Implement reset password
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password: ' + (error as Error).message });
  }
});

// Token management
router.post('/refresh-token', async (req, res) => {
  try {
    // TODO: Implement refresh token
    res.json({ message: 'Token refreshed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error refreshing token: ' + (error as Error).message });
  }
});

router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // TODO: Implement logout
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out: ' + (error as Error).message });
  }
});

// Protected routes
router.get('/profile', authenticateToken, isUser, (req, res) => {
  res.json({ user: req.user });
});

router.get('/admin', authenticateToken, isAdmin, (req, res) => {
  res.json({ message: 'Admin access granted' });
});

export default router;
