import { User } from '../models/User.js';
import { Drive } from '../models/Drive.js';
import { Document } from '../models/Document.js';
import { Offer } from '../models/Offer.js';
import { Application } from '../models/Application.js';
import { PlacementPolicy } from '../models/PlacementPolicy.js';
import { EligibilityEngine } from '../services/EligibilityEngine.js';
import { RecommendationEngine } from '../services/RecommendationEngine.js';
import { ReadinessScoreService } from '../services/ReadinessScoreService.js';
import { AuditService } from '../services/AuditService.js';
import { NotificationService } from '../services/NotificationService.js';

// @desc    Evaluate student eligibility for a specific drive with full explainability
// @route   GET /api/student/eligibility/:driveId
export const checkDriveEligibility = async (req, res, next) => {
  try {
    const student = await User.findById(req.user._id);
    const drive = await Drive.findById(req.params.driveId);

    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    const evaluation = EligibilityEngine.evaluate(student, drive);

    // Check if already applied
    const existingApp = await Application.findOne({ student: student._id, drive: drive._id });

    res.json({
      success: true,
      data: {
        ...evaluation,
        hasApplied: Boolean(existingApp),
        applicationStatus: existingApp ? existingApp.status : null,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get smart categorized placement recommendations for student
// @route   GET /api/student/recommendations
export const getRecommendations = async (req, res, next) => {
  try {
    const student = await User.findById(req.user._id);
    const drives = await Drive.find({
      status: { $in: ['PUBLISHED', 'APPLICATIONS_OPEN', 'APPROVED'] },
    }).sort({ createdAt: -1 });

    const studentApplications = await Application.find({ student: student._id });
    const appliedMap = new Map();
    studentApplications.forEach(a => {
      if (a.drive) {
        appliedMap.set(a.drive.toString(), {
          status: a.status,
          appliedDate: a.appliedDate || a.createdAt,
          applicationId: a._id.toString()
        });
      }
    });

    const recommendations = RecommendationEngine.getRecommendations(student, drives);

    const enrich = (item) => {
      const appInfo = appliedMap.get(item.driveId?.toString());
      return {
        ...item,
        hasApplied: Boolean(appInfo),
        applicationStatus: appInfo?.status || null,
        appliedDate: appInfo?.appliedDate || null,
        applicationId: appInfo?.applicationId || null,
      };
    };

    recommendations.recommended = recommendations.recommended.map(enrich);
    recommendations.eligible = recommendations.eligible.map(enrich);
    recommendations.nearMatch = recommendations.nearMatch.map(enrich);
    recommendations.notEligible = recommendations.notEligible.map(enrich);

    res.json({ success: true, data: recommendations });
  } catch (err) {
    next(err);
  }
};

// @desc    Get 6-pillar placement readiness score and actionable next steps
// @route   GET /api/student/readiness
export const getReadinessScore = async (req, res, next) => {
  try {
    const student = await User.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    const documents = await Document.find({ owner: student._id, isDeleted: false });

    const readiness = ReadinessScoreService.calculate(student, documents);
    res.json({ success: true, data: readiness });
  } catch (err) {
    next(err);
  }
};

// @desc    Get student documents
// @route   GET /api/student/documents
export const getMyDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ owner: req.user._id, isDeleted: false }).sort({ createdAt: -1 });
    res.json({ success: true, count: documents.length, data: documents });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload / Register student document
// @route   POST /api/student/documents
export const uploadDocument = async (req, res, next) => {
  try {
    const { title, type, fileUrl, fileName, fileSize, mimeType } = req.body;

    const doc = await Document.create({
      owner: req.user._id,
      title: title || `${type} Document`,
      type,
      fileUrl: fileUrl || '/sample-document.pdf',
      fileName: fileName || `${type}.pdf`,
      fileSize: fileSize || '1.5 MB',
      mimeType: mimeType || (fileUrl?.startsWith('data:image') ? 'image/png' : 'application/pdf'),
      status: 'UNDER_REVIEW',
    });

    // Notify TNP
    await NotificationService.send({
      title: `New Document for Verification: ${req.user.name}`,
      message: `${req.user.name} uploaded "${doc.title}" (${type}) for verification.`,
      type: 'ROLE_BASED',
      recipientRole: 'TNP',
      entityType: 'DOCUMENT',
      entityId: doc._id,
    });

    res.status(201).json({ success: true, message: 'Document uploaded for TNP verification', data: doc });
  } catch (err) {
    next(err);
  }
};

// @desc    Get offers received by student
// @route   GET /api/student/offers
export const getMyOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find({ student: req.user._id, isDeleted: false }).sort({ createdAt: -1 });
    res.json({ success: true, count: offers.length, data: offers });
  } catch (err) {
    next(err);
  }
};

// @desc    Accept or Decline Offer
// @route   PUT /api/student/offers/:id/respond
export const respondToOffer = async (req, res, next) => {
  try {
    const { action, declineReason } = req.body; // 'ACCEPT' or 'DECLINE'
    const offer = await Offer.findOne({ _id: req.params.id, student: req.user._id });

    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    if (!['ACCEPT', 'DECLINE'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Action must be ACCEPT or DECLINE' });
    }
    if (!['RELEASED', 'VIEWED'].includes(offer.status)) {
      return res.status(409).json({ success: false, message: 'This offer has already been responded to' });
    }

    if (action === 'ACCEPT') {
      const policy = (await PlacementPolicy.findOne()) || {};
      offer.status = 'ACCEPTED';
      offer.responseDate = new Date();
      await offer.save();

      // Update student status
      const student = await User.findById(req.user._id);
      student.studentDetails.placementStatus = policy.placementFreezeOnAcceptance ? 'PLACED' : 'OFFER_ACCEPTED';
      student.studentDetails.currentOffer = {
        company: offer.companyName,
        role: offer.role,
        ctc: offer.ctc,
        acceptedDate: new Date(),
      };
      student.studentDetails.placementCount = (student.studentDetails.placementCount || 0) + 1;
      await student.save();

      // Update application
      await Application.findOneAndUpdate(
        { student: req.user._id, drive: offer.drive },
        { status: 'ACCEPTED' }
      );

      await AuditService.log({
        actor: req.user._id,
        actorName: req.user.name,
        actorRole: 'STUDENT',
        action: 'ACCEPT_OFFER',
        entityType: 'OFFER',
        entityId: offer._id,
        newValue: { status: 'ACCEPTED', ctc: offer.ctc },
      });

      res.json({ success: true, message: 'Offer accepted! Congratulations on your campus placement.', data: offer });
    } else {
      offer.status = 'DECLINED';
      offer.declineReason = declineReason || 'Declined by student';
      offer.responseDate = new Date();
      await offer.save();

      await Application.findOneAndUpdate(
        { student: req.user._id, drive: offer.drive },
        { status: 'DECLINED' }
      );

      res.json({ success: true, message: 'Offer declined.', data: offer });
    }
  } catch (err) {
    next(err);
  }
};
