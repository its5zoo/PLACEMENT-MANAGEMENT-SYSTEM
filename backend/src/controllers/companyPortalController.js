import { Company } from '../models/Company.js';
import { Drive } from '../models/Drive.js';
import { Application } from '../models/Application.js';
import { Offer } from '../models/Offer.js';
import { User } from '../models/User.js';
import { AuditService } from '../services/AuditService.js';
import { NotificationService } from '../services/NotificationService.js';

// Helper to resolve company for authenticated company user
const resolveCompany = async (user) => {
  if (user?.companyRef) {
    const comp = await Company.findOne({ _id: user.companyRef, isDeleted: false });
    if (comp) return comp;
  }
  // Fallback: match by email or name, or pick first available active company
  let comp = await Company.findOne({
    $or: [
      { hrEmail: user?.email },
      { name: { $regex: (user?.name || '').replace(/[\(\)]/g, ''), $options: 'i' } },
    ],
    isDeleted: false,
  });
  if (!comp) {
    comp = await Company.findOne({ isDeleted: false });
  }
  if (!comp) {
    comp = await Company.create({
      name: 'Google India',
      legalName: 'Google India Private Limited',
      industry: 'Technology',
      website: 'https://careers.google.com',
      verificationStatus: 'VERIFIED',
    });
  }
  if (user && comp) {
    await User.findByIdAndUpdate(user._id, { companyRef: comp._id });
  }
  return comp;
};

// @desc    Get company dashboard statistics
// @route   GET /api/company/dashboard
export const getCompanyDashboard = async (req, res, next) => {
  try {
    const company = await resolveCompany(req.user);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company record not found for this account' });
    }
    const drives = await Drive.find({ company: company._id, isDeleted: false });
    const driveIds = drives.map((d) => d._id);

    const totalApplicants = await Application.countDocuments({ drive: { $in: driveIds }, isDeleted: false });
    const shortlistedCount = await Application.countDocuments({
      drive: { $in: driveIds },
      isDeleted: false,
      status: { $in: ['SHORTLISTED', 'ROUND_1', 'ROUND_2', 'ROUND_3', 'FINAL_INTERVIEW', 'SELECTED', 'OFFERED', 'ACCEPTED'] },
    });
    const interviewingCount = await Application.countDocuments({
      drive: { $in: driveIds },
      isDeleted: false,
      status: { $in: ['ROUND_1', 'ROUND_2', 'ROUND_3', 'FINAL_INTERVIEW'] },
    });
    const selectedCount = await Application.countDocuments({
      drive: { $in: driveIds },
      isDeleted: false,
      status: { $in: ['SELECTED', 'OFFERED', 'ACCEPTED'] },
    });
    const offersCount = await Offer.countDocuments({ company: company._id });

    const activeDrivesCount = drives.filter((d) => ['APPLICATIONS_OPEN', 'PUBLISHED', 'SHORTLISTING', 'INTERVIEWING'].includes(d.status)).length;
    const pendingApprovalCount = drives.filter((d) => ['SUBMITTED', 'UNDER_REVIEW', 'NEEDS_CORRECTION'].includes(d.status)).length;

    res.json({
      success: true,
      data: {
        company,
        metrics: {
          totalDrives: drives.length,
          activeDrives: activeDrivesCount,
          pendingApproval: pendingApprovalCount,
          totalApplicants,
          shortlisted: shortlistedCount,
          interviewing: interviewingCount,
          selected: selectedCount,
          offersReleased: offersCount,
        },
        drives,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current company profile
// @route   GET /api/company/profile
export const getCompanyProfile = async (req, res, next) => {
  try {
    const company = await resolveCompany(req.user);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company record not found for this account' });
    }
    res.json({ success: true, data: company });
  } catch (err) {
    next(err);
  }
};

// @desc    Update company profile
// @route   PUT /api/company/profile
export const updateCompanyProfile = async (req, res, next) => {
  try {
    const company = await resolveCompany(req.user);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company record not found for this account' });
    }

    const editableFields = [
      'legalName', 'industry', 'description', 'website', 'headOffice', 'locations',
      'logoText', 'logoBg', 'hrName', 'hrDesignation', 'hrEmail', 'hrContact',
    ];
    for (const field of editableFields) {
      if (req.body[field] !== undefined) company[field] = req.body[field];
    }
    company.verificationStatus = 'PROFILE_SUBMITTED';
    await company.save();

    await AuditService.log({
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: 'COMPANY',
      action: 'UPDATE_COMPANY_PROFILE',
      entityType: 'COMPANY',
      entityId: company._id,
      newValue: req.body,
    });

    res.json({ success: true, message: 'Company profile updated and submitted for review', data: company });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new Placement Drive request (Draft or Submit to TNP)
// @route   POST /api/company/drives
export const createCompanyDrive = async (req, res, next) => {
  try {
    const company = await resolveCompany(req.user);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company record not found for this account' });
    }
    const {
      title,
      role,
      ctc,
      baseSalary,
      variablePay,
      location,
      workMode,
      employmentType,
      applicationDeadline,
      description,
      eligibility,
      rounds,
      requiredDocuments,
      submitNow,
    } = req.body;

    const status = submitNow ? 'SUBMITTED' : 'DRAFT';

    const drive = await Drive.create({
      title: title || `${company.name} - ${role}`,
      role,
      company: company._id,
      companyName: company.name,
      ctc,
      baseSalary,
      variablePay,
      location,
      workMode: workMode || 'On-site',
      employmentType: employmentType || 'Full Time',
      applicationDeadline: applicationDeadline || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      description,
      eligibility: eligibility || {},
      rounds: rounds || [
        { roundIndex: 1, name: 'Online Coding Assessment', type: 'Coding Test' },
        { roundIndex: 2, name: 'Technical Interview', type: 'Technical Interview' },
        { roundIndex: 3, name: 'HR Interview', type: 'HR Interview' },
      ],
      requiredDocuments: requiredDocuments || ['Resume', '10th Marksheet', '12th Marksheet'],
      status,
      logoBg: company.logoBg || '#eff6ff',
      logoText: company.logoText || company.name.slice(0, 2).toUpperCase(),
    });

    // Notify TNP
    if (status === 'SUBMITTED') {
      await NotificationService.send({
        title: `New Placement Drive Submitted: ${company.name}`,
        message: `${company.name} submitted a new drive for ${role} (${ctc}) requiring TNP review.`,
        type: 'ROLE_BASED',
        recipientRole: 'TNP',
        priority: 'HIGH',
        entityType: 'DRIVE',
        entityId: drive._id,
      });
    }

    await AuditService.log({
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: 'COMPANY',
      action: status === 'SUBMITTED' ? 'SUBMIT_DRIVE' : 'CREATE_DRIVE_DRAFT',
      entityType: 'DRIVE',
      entityId: drive._id,
      newValue: { title, role, status },
    });

    res.status(201).json({ success: true, message: `Drive ${status === 'SUBMITTED' ? 'submitted to TNP' : 'saved as draft'}`, data: drive });
  } catch (err) {
    next(err);
  }
};

// @desc    Resubmit drive with corrections
// @route   PUT /api/company/drives/:id/resubmit
export const resubmitDrive = async (req, res, next) => {
  try {
    const company = await resolveCompany(req.user);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company record not found for this account' });
    }
    const drive = await Drive.findOne({ _id: req.params.id, company: company._id, isDeleted: false });
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Drive not found' });
    }

    if (!['DRAFT', 'NEEDS_CORRECTION'].includes(drive.status)) {
      return res.status(409).json({ success: false, message: 'Only draft or correction-requested drives can be submitted' });
    }
    const editableFields = [
      'title', 'role', 'ctc', 'baseSalary', 'variablePay', 'location', 'workMode',
      'employmentType', 'applicationDeadline', 'description', 'responsibilities',
      'eligibility', 'rounds', 'requiredDocuments',
    ];
    for (const field of editableFields) {
      if (req.body[field] !== undefined) drive[field] = req.body[field];
    }
    drive.status = 'SUBMITTED';
    drive.criteriaVersion = (drive.criteriaVersion || 1) + 1;
    await drive.save();

    await NotificationService.send({
      title: `Drive Resubmitted: ${drive.companyName}`,
      message: `${drive.companyName} updated and resubmitted drive for ${drive.role}.`,
      type: 'ROLE_BASED',
      recipientRole: 'TNP',
      entityType: 'DRIVE',
      entityId: drive._id,
    });

    res.json({ success: true, message: 'Drive resubmitted for TNP review', data: drive });
  } catch (err) {
    next(err);
  }
};

// @desc    Get applicants for a company drive (or all company drives)
// @route   GET /api/company/drives/:id/applicants
export const getDriveApplicants = async (req, res, next) => {
  try {
    const company = await resolveCompany(req.user);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company record not found for this account' });
    }

    const { status } = req.query;
    let drive = null;
    let query = { isDeleted: false };

    if (req.params.id && req.params.id !== 'all') {
      drive = await Drive.findOne({ _id: req.params.id, company: company._id, isDeleted: false });
      if (drive) {
        query.drive = drive._id;
      } else {
        query.company = company._id;
      }
    } else {
      const companyDrives = await Drive.find({ company: company._id, isDeleted: false });
      const driveIds = companyDrives.map(d => d._id);
      query.$or = [{ drive: { $in: driveIds } }, { company: company._id }];
    }

    if (status && status !== 'ALL') {
      query.status = status;
    }

    const applicants = await Application.find(query)
      .populate('student', 'name email phone avatar location studentDetails')
      .populate('drive', 'role title companyName ctc location eligibility')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applicants.length,
      drive: drive || (applicants[0]?.drive || null),
      data: applicants,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get complete student profile for company review
// @route   GET /api/company/students/:id
export const getStudentProfileForCompany = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id)
      .select('-password')
      .lean();
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    res.json({ success: true, data: student });
  } catch (err) {
    next(err);
  }
};

// @desc    Shortlist candidate for drive
// @route   PUT /api/company/applications/:id/shortlist
export const shortlistApplicant = async (req, res, next) => {
  try {
    const company = await resolveCompany(req.user);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company record not found for this account' });
    }
    const application = await Application.findOne({ _id: req.params.id, isDeleted: false })
      .populate('drive', 'company');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    if (!application.drive || String(application.drive.company) !== String(company._id)) {
      return res.status(403).json({ success: false, message: 'Application does not belong to your company' });
    }
    if (!['APPLIED', 'UNDER_REVIEW'].includes(application.status)) {
      return res.status(409).json({ success: false, message: 'Only new or under-review applications can be shortlisted' });
    }

    application.status = 'SHORTLISTED';
    application.currentRoundName = 'Round 1 Assessment';
    await application.save();

    await NotificationService.send({
      title: `Shortlisted: ${application.companyName}`,
      message: `Congratulations! You have been shortlisted for ${application.role} at ${application.companyName}.`,
      recipient: application.student,
      type: 'PERSONAL',
      priority: 'HIGH',
    });

    res.json({ success: true, message: 'Candidate shortlisted successfully', data: application });
  } catch (err) {
    next(err);
  }
};

// @desc    Release offer to selected student
// @route   POST /api/company/offers/release
export const releaseOffer = async (req, res, next) => {
  try {
    const { studentId, driveId, ctc, baseSalary, joiningDate, location, role } = req.body;
    const company = await resolveCompany(req.user);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company record not found for this account' });
    }
    const [drive, application] = await Promise.all([
      Drive.findOne({ _id: driveId, company: company._id, isDeleted: false }),
      Application.findOne({ student: studentId, drive: driveId, isDeleted: false }),
    ]);
    if (!drive || !application) {
      return res.status(404).json({ success: false, message: 'Drive or candidate application not found for your company' });
    }
    if (!['SHORTLISTED', 'FINAL_INTERVIEW', 'SELECTED'].includes(application.status)) {
      return res.status(409).json({ success: false, message: 'Candidate must be shortlisted or selected before an offer is released' });
    }

    const offer = await Offer.create({
      student: studentId,
      drive: driveId,
      company: company._id,
      companyName: company.name,
      role: role || drive.role,
      ctc: ctc || drive.ctc,
      baseSalary: baseSalary || '10 LPA',
      location: location || 'Bengaluru',
      joiningDate: joiningDate || 'July 2027',
      status: 'RELEASED',
    });

    // Update application status to OFFERED
    application.status = 'OFFERED';
    application.remarks = `Offer released: ${offer.ctc}`;
    await application.save();

    // Update student status
    await User.findByIdAndUpdate(studentId, {
      'studentDetails.placementStatus': 'OFFER_RECEIVED',
    });

    await NotificationService.send({
      title: `🎉 Offer Letter Released: ${company.name}`,
      message: `${company.name} has released a formal placement offer for ${offer.role} with CTC ${offer.ctc}!`,
      recipient: studentId,
      type: 'PERSONAL',
      priority: 'URGENT',
    });

    res.status(201).json({ success: true, message: 'Offer released successfully', data: offer });
  } catch (err) {
    next(err);
  }
};
