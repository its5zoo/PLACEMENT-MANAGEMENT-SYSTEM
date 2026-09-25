import express from 'express';
import {
  getTnpDashboard,
  getCompanyRequests,
  reviewDriveRequest,
  getStudentsList,
  updateStudentAcademics,
  getDocumentRequests,
  verifyDocument,
  getPlacementCases,
  updatePlacementCase,
  createAnnouncement,
  getAuditLogs,
  getPolicy,
  updatePolicy,
} from '../controllers/tnpController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All TNP routes protected and authorized for TNP, TNP_ADMIN, SUPER_ADMIN
router.use(protect);
router.use(authorize('TNP', 'TNP_ADMIN', 'SUPER_ADMIN'));

router.get('/dashboard', getTnpDashboard);
router.get('/company-requests', getCompanyRequests);
router.put('/company-requests/:id/review', reviewDriveRequest);
router.get('/students', getStudentsList);
router.put('/students/:id/academics', updateStudentAcademics);
router.get('/documents', getDocumentRequests);
router.put('/documents/:id/verify', verifyDocument);
router.get('/cases', getPlacementCases);
router.put('/cases/:id', updatePlacementCase);
router.post('/announcements', createAnnouncement);
router.get('/audit-logs', getAuditLogs);
router.get('/policy', getPolicy);
router.put('/policy', updatePolicy);

export default router;
