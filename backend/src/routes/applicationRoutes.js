import express from 'express';
import { applyToJob, getMyApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', protect, applyToJob);
router.get('/my', protect, getMyApplications);
router.put('/:id/status', protect, authorize('admin', 'tpo'), updateApplicationStatus);

export default router;
