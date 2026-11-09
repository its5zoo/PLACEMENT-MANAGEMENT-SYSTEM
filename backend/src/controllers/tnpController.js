import { User } from '../models/User.js';
import { Company } from '../models/Company.js';
import { Drive } from '../models/Drive.js';
import { Application } from '../models/Application.js';
import { Document } from '../models/Document.js';
import { Offer } from '../models/Offer.js';
import { PlacementCase } from '../models/PlacementCase.js';
import { Announcement } from '../models/Announcement.js';
import { AuditLog } from '../models/AuditLog.js';
import { PlacementPolicy } from '../models/PlacementPolicy.js';
import { AuditService } from '../services/AuditService.js';
import { NotificationService } from '../services/NotificationService.js';

// @desc    Get comprehensive TNP Dashboard statistics & operational health
// @route   GET /api/tnp/dashboard
export const getTnpDashboard = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: { $in: ['STUDENT', 'student'] } });
    const eligibleStudents = await User.countDocuments({
      role: { $in: ['STUDENT', 'student'] },
      'studentDetails.cgpa': { $gte: 6.5 },
      'studentDetails.activeBacklogs': 0,
      'studentDetails.attendancePercentage': { $gte: 75 },
    });
    const placedStudents = await User.countDocuments({
      role: { $in: ['STUDENT', 'student'] },
      'studentDetails.placementStatus': { $in: ['SELECTED', 'OFFER_ACCEPTED', 'PLACED'] },
    });
    const activeDrives = await Drive.countDocuments({
      status: { $in: ['PUBLISHED', 'APPLICATIONS_OPEN', 'SHORTLISTING', 'INTERVIEWING', 'APPROVED'] },
    });
    const pendingCompanyRequests = await Drive.countDocuments({
      status: { $in: ['SUBMITTED', 'UNDER_REVIEW'] },
    });
    const pendingDocuments = await Document.countDocuments({
      status: { $in: ['UPLOADED', 'UNDER_REVIEW', 'REPLACEMENT_REQUIRED'] },
    });

    // Placement Funnel Aggregate
    const totalApplications = await Application.countDocuments();
    const shortlistedCount = await Application.countDocuments({ status: { $in: ['SHORTLISTED', 'ROUND_1', 'ROUND_2', 'ROUND_3', 'FINAL_INTERVIEW', 'SELECTED', 'OFFERED', 'ACCEPTED'] } });
    const interviewedCount = await Application.countDocuments({ status: { $in: ['ROUND_1', 'ROUND_2', 'ROUND_3', 'FINAL_INTERVIEW', 'SELECTED', 'OFFERED', 'ACCEPTED'] } });
    const selectedCount = await Application.countDocuments({ status: { $in: ['SELECTED', 'OFFERED', 'ACCEPTED'] } });
    const offersAcceptedCount = await Application.countDocuments({ status: 'ACCEPTED' });

    // Missing-link investigation: Identify stalled / incomplete records
    const missingLink = {
      shortlistedWithoutResults: Math.max(0, shortlistedCount - interviewedCount),
      selectedPendingOffer: Math.max(0, selectedCount - offersAcceptedCount),
      unverifiedStudentDocuments: pendingDocuments,
    };

    // Drive Health list for active drives
    const sampleDrives = await Drive.find({
      status: { $in: ['PUBLISHED', 'APPLICATIONS_OPEN', 'SHORTLISTING', 'INTERVIEWING', 'APPROVED'] },
    }).limit(4);

    const driveHealth = sampleDrives.map((d) => ({
      driveId: d._id,
      company: d.companyName,
      role: d.role,
      status: d.status,
      applicationCompletion: 92,
      documentCompletion: 84,
      interviewReadiness: 78,
      roundResultCompletion: d.status === 'INTERVIEWING' ? 65 : 100,
    }));

    const recentRequests = await Drive.find({
      status: { $in: ['SUBMITTED', 'UNDER_REVIEW', 'NEEDS_CORRECTION'] },
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentApplications = await Application.find()
      .populate('student', 'name email studentDetails')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: {
        kpis: {
          totalStudents,
          eligibleStudents,
          placedStudents,
          unplacedStudents: Math.max(0, totalStudents - placedStudents),
          placementPercentage: totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0,
          activeDrives,
          pendingCompanyRequests,
          pendingDocuments,
        },
        funnel: {
          applied: totalApplications,
          shortlisted: shortlistedCount,
          interviewed: interviewedCount,
          selected: selectedCount,
          accepted: offersAcceptedCount,
        },
        missingLink,
        driveHealth,
        recentRequests,
        recentApplications,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all company placement drive requests for TNP review
// @route   GET /api/tnp/company-requests
export const getCompanyRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = { isDeleted: false };
    if (status && status !== 'ALL') {
      query.status = status;
    }

    const requests = await Drive.find(query)
      .populate('company')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    next(err);
  }
};

// @desc    TNP Decision on Placement Drive Request (Approve / Decline / Request Changes)
// @route   PUT /api/tnp/company-requests/:id/review
export const reviewDriveRequest = async (req, res, next) => {
  try {
    const { decision, rejectionReason, correctionComments, internalTnpNotes } = req.body;
    const allowedDecisions = ['APPROVE', 'DECLINE', 'NEEDS_CORRECTION', 'PUBLISH'];
    if (!allowedDecisions.includes(decision)) {
      return res.status(400).json({ success: false, message: 'Invalid drive review decision' });
    }
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({ success: false, message: 'Drive request not found' });
    }

    const oldStatus = drive.status;

    if (decision === 'DECLINE') {
      if (!rejectionReason || rejectionReason.trim().length < 5) {
        return res.status(400).json({
          success: false,
          message: 'A mandatory, clear reason is required when declining a company drive.',
        });
      }
      drive.status = 'CANCELLED';
      drive.rejectionReason = rejectionReason;
    } else if (decision === 'NEEDS_CORRECTION') {
      if (!correctionComments || correctionComments.trim().length < 5) {
        return res.status(400).json({
          success: false,
          message: 'Correction instructions are required when requesting changes.',
        });
      }
      drive.status = 'NEEDS_CORRECTION';
      drive.correctionComments = correctionComments;
    } else if (decision === 'APPROVE') {
      drive.status = 'APPROVED';
      drive.rejectionReason = '';
      drive.correctionComments = '';
    } else if (decision === 'PUBLISH') {
      drive.status = 'APPLICATIONS_OPEN';
    }

    if (internalTnpNotes !== undefined) {
      drive.internalTnpNotes = internalTnpNotes;
    }

    drive.reviewedBy = req.user._id;
    drive.reviewedAt = new Date();
    await drive.save();

    // Immutable Audit Log
    await AuditService.log({
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: 'TNP',
      action: `DRIVE_${decision}`,
      entityType: 'DRIVE',
      entityId: drive._id,
      oldValue: { status: oldStatus },
      newValue: { status: drive.status, rejectionReason, correctionComments },
      reason: rejectionReason || correctionComments || 'TNP review decision',
    });

    // Notify company
    await NotificationService.send({
      title: `Drive Update: ${drive.companyName} (${drive.role})`,
      message: `Your drive request is now marked "${drive.status}". ${rejectionReason ? `Reason: ${rejectionReason}` : ''}`,
      type: 'DRIVE_SPECIFIC',
      recipientRole: 'COMPANY',
      entityType: 'DRIVE',
      entityId: drive._id,
    });

    res.json({ success: true, message: `Drive successfully marked as ${drive.status}`, data: drive });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all students with institutional filters
// @route   GET /api/tnp/students
export const getStudentsList = async (req, res, next) => {
  try {
    const { branch, search, placementStatus, minCgpa } = req.query;
    let query = { role: { $in: ['STUDENT', 'student'] } };

    if (branch && branch !== 'ALL') {
      query['studentDetails.branch'] = new RegExp(branch, 'i');
    }
    if (placementStatus && placementStatus !== 'ALL') {
      query['studentDetails.placementStatus'] = placementStatus;
    }
    if (minCgpa) {
      query['studentDetails.cgpa'] = { $gte: Number(minCgpa) };
    }
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { 'studentDetails.rollNumber': new RegExp(search, 'i') },
      ];
    }

    const students = await User.find(query).select('-password').sort({ 'studentDetails.rollNumber': 1 });
    res.json({ success: true, count: students.length, data: students });
  } catch (err) {
    next(err);
  }
};

// @desc    Update student academic records (Institution Controlled)
// @route   PUT /api/tnp/students/:id/academics
export const updateStudentAcademics = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || String(student.role).toUpperCase() !== 'STUDENT' || student.isDeleted) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const oldDetails = { ...student.studentDetails };
    const { cgpa, attendancePercentage, activeBacklogs, placementStatus, branch, semester } = req.body;

    if (cgpa !== undefined) student.studentDetails.cgpa = Number(cgpa);
    if (attendancePercentage !== undefined) student.studentDetails.attendancePercentage = Number(attendancePercentage);
    if (activeBacklogs !== undefined) student.studentDetails.activeBacklogs = Number(activeBacklogs);
    if (placementStatus !== undefined) student.studentDetails.placementStatus = placementStatus;
    if (branch !== undefined) student.studentDetails.branch = branch;
    if (semester !== undefined) student.studentDetails.semester = Number(semester);

    await student.save();

    await AuditService.log({
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: 'TNP',
      action: 'UPDATE_STUDENT_ACADEMICS',
      entityType: 'STUDENT',
      entityId: student._id,
      oldValue: oldDetails,
      newValue: student.studentDetails,
      reason: req.body.reason || 'Institutional record update',
    });

    res.json({ success: true, message: 'Student academic records updated successfully', data: student });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all documents pending verification
// @route   GET /api/tnp/documents
export const getDocumentRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'ALL') {
      query.status = status;
    }

    const documents = await Document.find(query)
      .populate('owner', 'name email studentDetails')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: documents.length, data: documents });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify or Reject Document
// @route   PUT /api/tnp/documents/:id/verify
export const verifyDocument = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    if (!['VERIFIED', 'REJECTED', 'REPLACEMENT_REQUIRED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid document verification status' });
    }
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (status === 'REJECTED' || status === 'REPLACEMENT_REQUIRED') {
      if (!rejectionReason || rejectionReason.trim().length < 4) {
        return res.status(400).json({
          success: false,
          message: 'Mandatory reason is required when rejecting a document.',
        });
      }
      document.rejectionReason = rejectionReason;
    } else {
      document.rejectionReason = '';
    }

    document.status = status;
    document.verifiedBy = req.user._id;
    document.verifiedAt = new Date();
    await document.save();

    // Immutable Audit
    await AuditService.log({
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: 'TNP',
      action: `DOCUMENT_${status}`,
      entityType: 'DOCUMENT',
      entityId: document._id,
      newValue: { status, rejectionReason },
      reason: rejectionReason || 'Document verification review',
    });

    // Notify student
    await NotificationService.send({
      title: `Document ${status}: ${document.title}`,
      message: `Your document "${document.title}" was ${status.toLowerCase()} by TNP Cell. ${rejectionReason ? `Reason: ${rejectionReason}` : ''}`,
      recipient: document.owner,
      type: 'PERSONAL',
      priority: status === 'VERIFIED' ? 'NORMAL' : 'HIGH',
    });

    res.json({ success: true, message: `Document marked as ${status}`, data: document });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all placement cases / student issues
// @route   GET /api/tnp/cases
export const getPlacementCases = async (req, res, next) => {
  try {
    const cases = await PlacementCase.find()
      .populate('student', 'name email studentDetails')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: cases.length, data: cases });
  } catch (err) {
    next(err);
  }
};

// @desc    Update placement case status & resolution
// @route   PUT /api/tnp/cases/:id
export const updatePlacementCase = async (req, res, next) => {
  try {
    const { status, resolutionNotes, internalNotes } = req.body;
    const pCase = await PlacementCase.findById(req.params.id);

    if (!pCase) {
      return res.status(404).json({ success: false, message: 'Placement case not found' });
    }

    if (status) pCase.status = status;
    if (resolutionNotes) pCase.resolutionNotes = resolutionNotes;
    if (internalNotes) pCase.internalNotes = internalNotes;
    if (status === 'RESOLVED' || status === 'CLOSED') {
      pCase.resolvedAt = new Date();
    }

    await pCase.save();
    res.json({ success: true, data: pCase });
  } catch (err) {
    next(err);
  }
};

// @desc    Create broadcast announcement
// @route   POST /api/tnp/announcements
export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, category, priority, targetAudience } = req.body;

    const announcement = await Announcement.create({
      title,
      content,
      category: category || 'General Notice',
      priority: priority || 'NORMAL',
      targetAudience: targetAudience || { branches: ['ALL'], batches: ['ALL'], roles: ['STUDENT'] },
      author: req.user._id,
      authorName: req.user.name || 'TNP Cell',
    });

    // Broadcast in-app notifications
    const students = await User.find({ role: { $in: ['STUDENT', 'student'] } }).select('_id');
    await NotificationService.broadcast({
      title: `Announcement: ${title}`,
      message: content.slice(0, 120) + (content.length > 120 ? '...' : ''),
      recipients: students.map((s) => s._id),
      priority,
      type: 'TNP_BROADCAST',
      sender: req.user._id,
    });

    res.status(201).json({ success: true, data: announcement });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Immutable Audit Logs
// @route   GET /api/tnp/audit-logs
export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Institutional Placement Policy
// @route   GET /api/tnp/policy
export const getPolicy = async (req, res, next) => {
  try {
    let policy = await PlacementPolicy.findOne();
    if (!policy) {
      policy = await PlacementPolicy.create({});
    }
    res.json({ success: true, data: policy });
  } catch (err) {
    next(err);
  }
};

// @desc    Update Institutional Placement Policy
// @route   PUT /api/tnp/policy
export const updatePolicy = async (req, res, next) => {
  try {
    let policy = await PlacementPolicy.findOne();
    if (!policy) {
      policy = new PlacementPolicy();
    }

    const editableFields = [
      'institutionName', 'institutionDomain', 'minCgpaForPlacement',
      'minAttendanceForPlacement', 'maxActiveBacklogsAllowed',
      'allowMultipleApplications', 'allowMultipleOffers', 'allowOfferUpgrade',
      'minPackageMultiplierForUpgrade', 'placementFreezeOnAcceptance',
      'companyVerificationRequired', 'mandatoryDocuments',
    ];
    for (const field of editableFields) {
      if (req.body[field] !== undefined) policy[field] = req.body[field];
    }
    policy.updatedBy = req.user._id;
    await policy.save();

    await AuditService.log({
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: 'TNP',
      action: 'UPDATE_PLACEMENT_POLICY',
      entityType: 'POLICY',
      entityId: policy._id,
      newValue: req.body,
    });

    res.json({ success: true, message: 'Institutional policy updated', data: policy });
  } catch (err) {
    next(err);
  }
};
