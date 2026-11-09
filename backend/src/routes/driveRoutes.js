import express from 'express';
import { getDrives, getDriveById, createDrive, updateDrive, deleteDrive } from '../controllers/driveController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getDrives);
router.get('/:id', getDriveById);
router.post('/', protect, authorize('admin', 'tpo'), createDrive);
router.put('/:id', protect, authorize('admin', 'tpo'), updateDrive);
router.delete('/:id', protect, authorize('admin', 'tpo'), deleteDrive);

export default router;
