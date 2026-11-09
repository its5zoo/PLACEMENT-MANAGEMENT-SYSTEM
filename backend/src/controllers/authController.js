import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const editableStudentFields = [
  'personalEmail',
  'skills',
  'certifications',
  'projects',
  'experience',
  'willingToRelocate',
  'willingToTravel',
  'preferredWorkMode',
  'hobbies',
  'languages',
  'careerObjective',
  'resumeUrl',
  'githubUrl',
  'linkedinUrl',
  'portfolioUrl',
];

const pickEditableStudentDetails = (studentDetails = {}) => Object.fromEntries(
  Object.entries(studentDetails).filter(([key]) => editableStudentFields.includes(key))
);

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, studentDetails, phone, location } = req.body;

    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Name, a valid email, and a password of at least 6 characters are required',
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'STUDENT',
      phone,
      location,
      studentDetails: pickEditableStudentDetails(studentDetails),
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        avatar: user.avatar,
        studentDetails: user.studentDetails,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isActive: true, isDeleted: false });
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          avatar: user.avatar,
          studentDetails: user.studentDetails,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.location = req.body.location || user.location;
    user.avatar = req.body.avatar || user.avatar;

    if (req.body.studentDetails) {
      const safeStudentDetails = pickEditableStudentDetails(req.body.studentDetails);
      user.studentDetails = {
        ...user.studentDetails.toObject(),
        ...safeStudentDetails,
      };
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        location: updatedUser.location,
        avatar: updatedUser.avatar,
        studentDetails: updatedUser.studentDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};
