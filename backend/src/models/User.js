import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['STUDENT', 'COMPANY', 'TNP', 'TNP_ADMIN', 'SUPER_ADMIN', 'student', 'tpo', 'admin', 'recruiter'],
      default: 'STUDENT',
      set: (v) => v.toUpperCase(),
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
    },
    location: {
      type: String,
      default: 'Delhi, India',
    },
    avatar: {
      type: String,
      default: '/doraemon.png',
    },
    // Company reference if role is COMPANY
    companyRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    // Comprehensive student details
    studentDetails: {
      rollNumber: { type: String, default: '', index: true },
      rollNo: { type: String, default: '' },
      institutionEmail: { type: String, default: '' },
      personalEmail: { type: String, default: '' },
      department: { type: String, default: '' },
      branch: { type: String, default: '' },
      program: { type: String, default: '' },
      semester: { type: Number, default: 0 },
      batch: { type: String, default: '' },
      graduationYear: { type: Number, default: null },
      section: { type: String, default: '' },
      // Academic records (Institution Controlled)
      cgpa: { type: Number, default: null },
      tenthPercentage: { type: Number, default: null },
      twelfthPercentage: { type: Number, default: null },
      diplomaPercentage: { type: Number, default: null },
      backlogs: { type: Number, default: 0 },
      activeBacklogs: { type: Number, default: 0 },
      attendancePercentage: { type: Number, default: 0 },
      // Placement workflow attributes
      placementStatus: {
        type: String,
        enum: ['UNPLACED', 'IN_PROCESS', 'SELECTED', 'OFFER_RECEIVED', 'OFFER_ACCEPTED', 'PLACED', 'WITHDRAWN'],
        default: 'UNPLACED',
      },
      placementCount: { type: Number, default: 0 },
      currentOffer: {
        company: String,
        role: String,
        ctc: String,
        acceptedDate: Date,
      },
      // Student-editable profile fields
      skills: {
        type: [String],
        default: [],
      },
      certifications: [
        {
          title: String,
          issuer: String,
          year: String,
        },
      ],
      projects: [
        {
          title: String,
          description: String,
          techStack: [String],
          link: String,
        },
      ],
      resumeUrl: { type: String, default: '' },
      resumeVerified: { type: Boolean, default: false },
      githubUrl: { type: String, default: '' },
      linkedinUrl: { type: String, default: '' },
      portfolioUrl: { type: String, default: '' },
      profileCompletionPercent: { type: Number, default: 0 },
    },
    // Audit info
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
