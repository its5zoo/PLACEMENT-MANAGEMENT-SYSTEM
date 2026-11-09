import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { Notification } from '../models/Notification.js';
import { Drive } from '../models/Drive.js';
import { EligibilityEngine } from '../services/EligibilityEngine.js';

// @desc    Apply to a job
// @route   POST /api/applications/apply
export const applyToJob = async (req, res, next) => {
  try {
    const { jobId, driveId } = req.body;
    const listingId = driveId || jobId;
    const studentId = req.user._id;

    if (!listingId) {
      return res.status(400).json({ success: false, message: 'jobId or driveId is required' });
    }

    // Strict role check: Only students can apply for campus placements
    if (req.user.role && !['STUDENT', 'student'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only registered students are eligible to apply for campus placement drives. Administrators and recruiters cannot submit student applications.',
      });
    }

    // The UI exposes both legacy Job records and the newer Drive records.
    const [job, drive] = await Promise.all([
      Job.findOne({ _id: listingId, status: 'active', isDeleted: { $ne: true } }),
      Drive.findOne({ _id: listingId, isDeleted: false }),
    ]);
    if (!job && !drive) {
      return res.status(404).json({ success: false, message: 'Active job or placement drive not found' });
    }

    if (drive && !['PUBLISHED', 'APPLICATIONS_OPEN', 'APPROVED'].includes(drive.status)) {
      return res.status(409).json({ success: false, message: 'This placement drive is not accepting applications' });
    }
    if (drive?.applicationDeadline && drive.applicationDeadline < new Date()) {
      return res.status(409).json({ success: false, message: 'The application deadline has passed' });
    }

    const duplicateQuery = drive
      ? { student: studentId, drive: drive._id }
      : { student: studentId, job: job._id };
    const existing = await Application.findOne(duplicateQuery);
    if (existing) {
      if (req.body.forceReapply || req.body.isDemoReapply) {
        existing.status = 'APPLIED';
        existing.appliedDate = new Date();
        await existing.save();
        return res.json({
          success: true,
          message: 'Application re-submitted successfully for demo!',
          data: existing,
          isReapplied: true
        });
      }
      return res.status(409).json({ success: false, message: 'You have already applied for this listing' });
    }

    let eligibilitySnapshot;
    if (drive) {
      const evaluation = EligibilityEngine.evaluate(req.user, drive);
      if (!evaluation.isEligible) {
        return res.status(422).json({
          success: false,
          message: 'You do not meet this drive\'s eligibility requirements',
          data: evaluation,
        });
      }
      eligibilitySnapshot = {
        cgpa: req.user.studentDetails?.cgpa,
        attendancePercentage: req.user.studentDetails?.attendancePercentage,
        activeBacklogs: req.user.studentDetails?.activeBacklogs,
        branch: req.user.studentDetails?.branch,
        graduationYear: req.user.studentDetails?.graduationYear,
        matchedSkills: evaluation.matchedSkills,
        isEligible: evaluation.isEligible,
        matchPercentage: evaluation.matchPercentage,
      };
    } else {
      const details = req.user.studentDetails || {};
      const criteria = job.eligibility || {};
      const isEligible = Number(details.cgpa || 0) >= Number(criteria.minCgpa || 0)
        && Number(details.activeBacklogs || 0) <= Number(criteria.backlogsAllowed || 0)
        && (!criteria.allowedBranches?.length || criteria.allowedBranches.includes(details.branch));
      if (!isEligible) {
        return res.status(422).json({ success: false, message: 'You do not meet this job\'s eligibility requirements' });
      }
      eligibilitySnapshot = {
        cgpa: details.cgpa,
        activeBacklogs: details.activeBacklogs,
        branch: details.branch,
        isEligible: true,
      };
    }

    const listing = drive || job;

    const application = await Application.create({
      student: studentId,
      job: job?._id,
      drive: drive?._id,
      company: drive?.company || job?.companyRef,
      companyName: drive?.companyName || job.company,
      role: listing.role,
      logo: drive?.logoText || job.logoText,
      logoBg: listing.logoBg || '#ffffff',
      location: listing.location,
      ctc: listing.ctc,
      status: 'APPLIED',
      eligibilitySnapshot,
    });

    // Create notification
    await Notification.create({
      user: studentId,
      title: `Applied to ${drive?.companyName || job.company}`,
      message: `Your application for ${listing.role} has been submitted successfully.`,
      time: 'Just now',
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student's applications
// @route   GET /api/applications/my
export const getMyApplications = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { status, search } = req.query;

    let query = { student: studentId, isDeleted: false };

    if (status && status !== 'All') {
      if (status === 'In Progress') {
        query.status = { $in: ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'ROUND_1', 'ROUND_2', 'ROUND_3', 'FINAL_INTERVIEW', 'In-Progress'] };
      } else if (status === 'Selected') {
        query.status = { $in: ['SELECTED', 'OFFERED', 'ACCEPTED'] };
      } else {
        query.status = status;
      }
    }

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await Application.find(query)
      .populate('company', 'name')
      .populate('drive', 'companyName role')
      .populate('job', 'company role')
      .sort({ createdAt: -1 });

    const isHexId = (val) => typeof val === 'string' && /^[0-9a-fA-F]{24}$/.test(val);

    const formattedApplications = applications.map((app) => {
      const doc = app.toObject ? app.toObject() : app;
      let cleanCompany = '';
      if (doc.company?.name && !isHexId(doc.company.name)) {
        cleanCompany = doc.company.name;
      } else if (doc.companyName && !isHexId(doc.companyName)) {
        cleanCompany = doc.companyName;
      } else if (doc.drive?.companyName && !isHexId(doc.drive.companyName)) {
        cleanCompany = doc.drive.companyName;
      } else if (doc.job?.company && !isHexId(doc.job.company)) {
        cleanCompany = doc.job.company;
      } else if (doc.logo === 'MS') {
        cleanCompany = 'Microsoft Corporation';
      } else if (doc.logo === 'G') {
        cleanCompany = 'Google India';
      } else if (doc.logo === 'AMZ') {
        cleanCompany = 'Amazon Web Services';
      } else {
        cleanCompany = 'Campus Recruiter';
      }

      doc.companyName = cleanCompany;
      return doc;
    });

    res.json({ success: true, count: formattedApplications.length, data: formattedApplications });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (TPO / Admin)
// @route   PUT /api/applications/:id/status
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, remarks, currentRound } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (status) application.status = status;
    if (remarks !== undefined) application.remarks = remarks;
    if (currentRound !== undefined) application.currentRoundName = currentRound;

    await application.save();

    // Create notification for student
    await Notification.create({
      user: application.student,
      title: `Application Status Updated: ${application.companyName}`,
      message: `Your status for ${application.role} is now "${application.status}".`,
      time: 'Just now',
    });

    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw student application
// @route   DELETE /api/applications/:listingId/withdraw
export const withdrawApplication = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { listingId } = req.params;
    const deleted = await Application.findOneAndDelete({
      student: studentId,
      $or: [{ drive: listingId }, { job: listingId }, { _id: listingId }]
    });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Application not found to withdraw' });
    }
    res.json({ success: true, message: 'Application withdrawn successfully' });
  } catch (error) {
    next(error);
  }
};
