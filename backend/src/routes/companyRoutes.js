import express from 'express';
import { getCompanies, getCompanyById, createCompany } from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCompanies);
router.get('/:id', getCompanyById);
router.post('/', protect, authorize('admin', 'tpo'), createCompany);

export default router;
