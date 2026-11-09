import express from 'express';
import { getCompanies, getCompanyById, createCompany, updateCompany, deleteCompany } from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCompanies);
router.get('/:id', getCompanyById);
router.post('/', protect, authorize('admin', 'tpo'), createCompany);
router.put('/:id', protect, authorize('admin', 'tpo'), updateCompany);
router.delete('/:id', protect, authorize('admin', 'tpo'), deleteCompany);

export default router;
