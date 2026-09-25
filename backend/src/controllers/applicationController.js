import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { Notification } from '../models/Notification.js';

// @desc    Apply to a job
// @route   POST /api/applications/apply
export const applyToJob = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    const studentId = req.user._id;

    // Check if already applied
    const existing = await Application.findOne({ student: studentId, job: jobId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const application = await Application.create({
      student: studentId,
      job: jobId,
      company: job.company,
      role: job.role,
      logo: job.logoText,
      logoBg: job.logoBg || '#ffffff',
      location: job.location,
      ctc: job.ctc,
      status: 'Applied',
    });

    // Create notification
    await Notification.create({
      user: studentId,
      title: `Applied to ${job.company}`,
      message: `Your application for ${job.role} has been submitted successfully.`,
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

    let query = { student: studentId };

    if (status && status !== 'All') {
      if (status === 'In Progress') {
        query.status = 'In-Progress';
      } else {
        query.status = status;
      }
    }

    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await Application.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: applications.length, data: applications });
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
    if (remarks) application.remarks = remarks;
    if (currentRound) application.currentRound = currentRound;

    await application.save();

    // Create notification for student
    await Notification.create({
      user: application.student,
      title: `Application Status Updated: ${application.company}`,
      message: `Your status for ${application.role} is now "${application.status}".`,
      time: 'Just now',
    });

    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};
