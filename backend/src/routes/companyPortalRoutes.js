import express from 'express';
import {
  getCompanyDashboard,
  getCompanyProfile,
  updateCompanyProfile,
  createCompanyDrive,
  resubmitDrive,
  getDriveApplicants,
  shortlistApplicant,
  releaseOffer,
} from '../controllers/companyPortalController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('COMPANY', 'TNP', 'TNP_ADMIN', 'SUPER_ADMIN'));

router.get('/dashboard', getCompanyDashboard);
router.get('/profile', getCompanyProfile);
router.put('/profile', updateCompanyProfile);
router.post('/drives', createCompanyDrive);
router.put('/drives/:id/resubmit', resubmitDrive);
router.get('/drives/:id/applicants', getDriveApplicants);
router.put('/applications/:id/shortlist', shortlistApplicant);
router.post('/offers/release', releaseOffer);

export default router;
