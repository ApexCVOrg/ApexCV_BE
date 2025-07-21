import express, { Router } from 'express';
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  checkFavorite,
  toggleFavorite,
  clearFavorites,
} from '../controllers/favorites.controller';
import { authenticateToken } from '../middlewares/auth';

const router: Router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Favorites routes
router.get('/', getFavorites);
router.post('/add/:productId', addToFavorites);
router.delete('/remove/:productId', removeFromFavorites);
router.get('/check/:productId', checkFavorite);
router.post('/toggle/:productId', toggleFavorite);
router.delete('/clear', clearFavorites);

export default router;
