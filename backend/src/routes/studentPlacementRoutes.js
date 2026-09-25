import express from 'express';
import {
  checkDriveEligibility,
  getRecommendations,
  getReadinessScore,
  getMyDocuments,
  uploadDocument,
  getMyOffers,
  respondToOffer,
} from '../controllers/studentPlacementController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/eligibility/:driveId', checkDriveEligibility);
router.get('/eligibility/explain/:driveId', checkDriveEligibility);
router.get('/recommendations', getRecommendations);
router.get('/readiness', getReadinessScore);
router.get('/documents', getMyDocuments);
router.post('/documents', uploadDocument);
router.get('/offers', getMyOffers);
router.put('/offers/:id/respond', respondToOffer);

export default router;
