import { Company } from '../models/Company.js';
import { Drive } from '../models/Drive.js';

// @desc    Get all companies (with search)
// @route   GET /api/companies
export const getCompanies = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = { isDeleted: false };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
      ];
    }

    const companies = await Company.find(query).sort({ name: 1 });
    res.json({ success: true, count: companies.length, data: companies });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
export const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findOne({ _id: req.params.id, isDeleted: false });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

// @desc    Create company
// @route   POST /api/companies
export const createCompany = async (req, res, next) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const protectedFields = ['_id', 'isDeleted', 'verifiedBy', 'verifiedAt'];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => !protectedFields.includes(key))
    );
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      updates,
      { new: true, runValidators: true }
    );
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

export const deleteCompany = async (req, res, next) => {
  try {
    const activeDrives = await Drive.countDocuments({ company: req.params.id, isDeleted: false });
    if (activeDrives > 0) {
      return res.status(409).json({
        success: false,
        message: 'Archive the company drives before deleting the company',
      });
    }
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.json({ success: true, message: 'Company archived successfully' });
  } catch (error) {
    next(error);
  }
};
