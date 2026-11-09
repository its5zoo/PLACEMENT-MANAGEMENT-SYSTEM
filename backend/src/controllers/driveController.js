import { Drive } from '../models/Drive.js';

// @desc    Get all placement drives
// @route   GET /api/drives
export const getDrives = async (req, res, next) => {
  try {
    const drives = await Drive.find({
      isDeleted: false,
      status: { $in: ['APPROVED', 'PUBLISHED', 'APPLICATIONS_OPEN', 'APPLICATIONS_CLOSED', 'SHORTLISTING', 'INTERVIEWING', 'RESULT_PENDING', 'COMPLETED'] },
    })
      .select('-internalTnpNotes -rejectionReason -correctionComments')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: drives.length, data: drives });
  } catch (error) {
    next(error);
  }
};

export const getDriveById = async (req, res, next) => {
  try {
    const drive = await Drive.findOne({
      _id: req.params.id,
      isDeleted: false,
      status: { $in: ['APPROVED', 'PUBLISHED', 'APPLICATIONS_OPEN', 'APPLICATIONS_CLOSED', 'SHORTLISTING', 'INTERVIEWING', 'RESULT_PENDING', 'COMPLETED'] },
    }).select('-internalTnpNotes -rejectionReason -correctionComments');
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }
    res.json({ success: true, data: drive });
  } catch (error) {
    next(error);
  }
};

export const updateDrive = async (req, res, next) => {
  try {
    const protectedFields = ['_id', 'company', 'companyName', 'reviewedBy', 'reviewedAt', 'isDeleted'];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => !protectedFields.includes(key))
    );
    const drive = await Drive.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      updates,
      { new: true, runValidators: true }
    );
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }
    res.json({ success: true, data: drive });
  } catch (error) {
    next(error);
  }
};

export const deleteDrive = async (req, res, next) => {
  try {
    const drive = await Drive.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, status: 'ARCHIVED' },
      { new: true }
    );
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }
    res.json({ success: true, message: 'Placement drive archived successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new placement drive
// @route   POST /api/drives
export const createDrive = async (req, res, next) => {
  try {
    const drive = await Drive.create(req.body);
    res.status(201).json({ success: true, data: drive });
  } catch (error) {
    next(error);
  }
};
