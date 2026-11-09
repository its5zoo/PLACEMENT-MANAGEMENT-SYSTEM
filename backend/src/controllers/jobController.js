import { Job } from '../models/Job.js';
import { Drive } from '../models/Drive.js';

// @desc    Get all active jobs & approved drives (with search & filter)
// @route   GET /api/jobs
export const getJobs = async (req, res, next) => {
  try {
    const { search, tag, location } = req.query;
    let jobQuery = { status: 'active', isDeleted: { $ne: true } };

    if (search) {
      jobQuery.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (tag) {
      jobQuery.tags = { $in: [new RegExp(tag, 'i')] };
    }

    if (location) {
      jobQuery.location = { $regex: location, $options: 'i' };
    }

    const jobs = await Job.find(jobQuery).sort({ createdAt: -1 });

    // Also fetch all approved/published campus drives from companies
    let driveQuery = {
      status: { $in: ['APPROVED', 'APPLICATIONS_OPEN', 'PUBLISHED', 'SHORTLISTING', 'INTERVIEWING'] },
      isDeleted: { $ne: true },
    };

    if (search) {
      driveQuery.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      driveQuery.location = { $regex: location, $options: 'i' };
    }

    const approvedDrives = await Drive.find(driveQuery).sort({ createdAt: -1 });

    const mappedDrives = approvedDrives.map((d) => ({
      _id: d._id,
      id: d._id,
      company: d.companyName,
      role: d.role,
      location: d.location,
      ctc: d.ctc,
      deadline: d.deadlineFormatted || (d.applicationDeadline ? new Date(d.applicationDeadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Open'),
      logoBg: d.logoBg || '#eff6ff',
      logoText: d.logoText || d.companyName.slice(0, 2).toUpperCase(),
      tags: (d.eligibility?.allowedBranches && d.eligibility.allowedBranches.length > 0)
        ? [...d.eligibility.allowedBranches, d.workMode || 'Full Time']
        : ['Full Time', 'Campus Drive'],
      description: d.description || `Campus placement hiring drive for ${d.role} at ${d.companyName}.`,
      eligibility: {
        minCgpa: d.eligibility?.minCgpa ?? 6.5,
        allowedBranches: d.eligibility?.allowedBranches ?? ['CSE', 'IT', 'ECE'],
        backlogsAllowed: d.eligibility?.maxActiveBacklogs ?? 0,
        minAttendance: d.eligibility?.minAttendance ?? 75,
      },
      status: 'active',
      isDrive: true,
      driveStatus: d.status,
      createdAt: d.createdAt,
    }));

    // Combine drives first (so newly approved drives appear at the top), then jobs
    const combined = [...mappedDrives];
    for (const job of jobs) {
      const isDuplicate = mappedDrives.some(
        (d) => d.company.toLowerCase() === job.company.toLowerCase() && d.role.toLowerCase() === job.role.toLowerCase()
      );
      if (!isDuplicate) {
        combined.push(job);
      }
    }

    res.json({ success: true, count: combined.length, data: combined });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
export const getJobById = async (req, res, next) => {
  try {
    let job = await Job.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
    if (!job) {
      const drive = await Drive.findOne({ _id: req.params.id, isDeleted: false });
      if (drive) {
        job = {
          _id: drive._id,
          company: drive.companyName,
          role: drive.role,
          location: drive.location,
          ctc: drive.ctc,
          deadline: drive.deadlineFormatted || (drive.applicationDeadline ? new Date(drive.applicationDeadline).toLocaleDateString('en-GB') : 'Open'),
          logoBg: drive.logoBg || '#eff6ff',
          logoText: drive.logoText || drive.companyName.slice(0, 2).toUpperCase(),
          tags: drive.eligibility?.allowedBranches || ['CSE', 'Full Time'],
          description: drive.description,
          eligibility: {
            minCgpa: drive.eligibility?.minCgpa ?? 6.5,
            allowedBranches: drive.eligibility?.allowedBranches ?? ['CSE', 'IT', 'ECE'],
            backlogsAllowed: drive.eligibility?.maxActiveBacklogs ?? 0,
            minAttendance: drive.eligibility?.minAttendance ?? 75,
          },
          status: 'active',
          isDrive: true,
        };
      }
    }
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new job (Admin / TPO / Recruiter)
// @route   POST /api/jobs
export const createJob = async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { isDeleted: true, status: 'closed' },
      { new: true }
    );
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, message: 'Job archived successfully' });
  } catch (error) {
    next(error);
  }
};
