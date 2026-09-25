import express from 'express';
import { getDrives, createDrive } from '../controllers/driveController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getDrives);
router.post('/', protect, authorize('admin', 'tpo'), createDrive);

export default router;
