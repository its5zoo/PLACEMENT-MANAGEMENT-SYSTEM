import { Application } from '../models/Application.js';
import { User } from '../models/User.js';

// @desc    Get dashboard summary statistics for student
// @route   GET /api/stats/dashboard
export const getDashboardStats = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const baseQuery = { student: studentId, isDeleted: false };
    const [totalApplied, inProgress, selectedOffers] = await Promise.all([
      Application.countDocuments(baseQuery),
      Application.countDocuments({
        ...baseQuery,
        status: { $in: ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'ROUND_1', 'ROUND_2', 'ROUND_3', 'FINAL_INTERVIEW', 'In-Progress'] },
      }),
      Application.countDocuments({
        ...baseQuery,
        status: { $in: ['SELECTED', 'OFFERED', 'ACCEPTED'] },
      }),
    ]);

    const rawRecent = await Application.find(baseQuery)
      .populate('company', 'name')
      .populate('drive', 'companyName')
      .populate('job', 'company')
      .sort({ createdAt: -1 })
      .limit(5);

    const isHexId = (val) => typeof val === 'string' && /^[0-9a-fA-F]{24}$/.test(val);
    const recentApplications = rawRecent.map((app) => {
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

    const user = await User.findById(studentId);

    res.json({
      success: true,
      data: {
        stats: {
          jobsApplied: totalApplied,
          inProgress: inProgress,
          offersReceived: selectedOffers,
        },
        profileCompletion: user?.studentDetails?.profileCompletionPercent || 0,
        recentApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};
