import express from 'express';
import { getJobs, getJobById, createJob, updateJob, deleteJob } from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('admin', 'tpo'), createJob);
router.put('/:id', protect, authorize('admin', 'tpo'), updateJob);
router.delete('/:id', protect, authorize('admin', 'tpo'), deleteJob);

export default router;
