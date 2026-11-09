import express from 'express';
import { applyToJob, getMyApplications, updateApplicationStatus, withdrawApplication } from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', protect, authorize('STUDENT'), applyToJob);
router.delete('/:listingId/withdraw', protect, authorize('STUDENT'), withdrawApplication);
router.get('/my', protect, authorize('STUDENT'), getMyApplications);
router.put('/:id/status', protect, authorize('admin', 'tpo'), updateApplicationStatus);

export default router;
