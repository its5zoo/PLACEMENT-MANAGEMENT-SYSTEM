import { Drive } from '../models/Drive.js';

// @desc    Get all placement drives
// @route   GET /api/drives
export const getDrives = async (req, res, next) => {
  try {
    const drives = await Drive.find().sort({ createdAt: -1 });
    res.json({ success: true, count: drives.length, data: drives });
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
