import { Application } from '../models/Application.js';
import { User } from '../models/User.js';

// @desc    Get dashboard summary statistics for student
// @route   GET /api/stats/dashboard
export const getDashboardStats = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const totalApplied = await Application.countDocuments({ student: studentId });
    const inProgress = await Application.countDocuments({ student: studentId, status: 'In-Progress' });
    const selectedOffers = await Application.countDocuments({ student: studentId, status: 'Selected' });

    const recentApplications = await Application.find({ student: studentId })
      .sort({ createdAt: -1 })
      .limit(5);

    const user = await User.findById(studentId);

    res.json({
      success: true,
      data: {
        stats: {
          jobsApplied: totalApplied,
          inProgress: inProgress,
          offersReceived: selectedOffers,
        },
        profileCompletion: user?.studentDetails?.profileCompletionPercent || 85,
        recentApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};
