import express from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('STUDENT'), getDashboardStats);

export default router;
