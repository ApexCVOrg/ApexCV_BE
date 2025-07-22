import express, { Router } from 'express'
import { authenticateToken } from '../middlewares/auth.js'
import { getSizeRecommendation } from '../controllers/sizeRecommendation.controller.js'

const router: Router = express.Router()

// Apply authentication middleware to all routes
router.use(authenticateToken)

// POST /api/size-recommendation
router.post('/', getSizeRecommendation)

export default router 