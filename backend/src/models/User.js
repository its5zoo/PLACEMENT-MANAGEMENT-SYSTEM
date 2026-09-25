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
      rollNumber: { type: String, default: '231CS001', index: true },
      rollNo: { type: String, default: '231CS001' },
      institutionEmail: { type: String, default: '231CS001.faizaan@giet.edu' },
      personalEmail: { type: String, default: 'faizaan@gmail.com' },
      department: { type: String, default: 'Computer Science' },
      branch: { type: String, default: 'CSE' },
      program: { type: String, default: 'B.Tech' },
      semester: { type: Number, default: 8 },
      batch: { type: String, default: '2023-2027' },
      graduationYear: { type: Number, default: 2027 },
      section: { type: String, default: 'A' },
      // Academic records (Institution Controlled)
      cgpa: { type: Number, default: 8.85 },
      tenthPercentage: { type: Number, default: 94.0 },
      twelfthPercentage: { type: Number, default: 92.4 },
      diplomaPercentage: { type: Number, default: null },
      backlogs: { type: Number, default: 0 },
      activeBacklogs: { type: Number, default: 0 },
      attendancePercentage: { type: Number, default: 87.5 },
      // Placement workflow attributes
      placementStatus: {
        type: String,
        enum: ['UNPLACED', 'IN_PROCESS', 'SELECTED', 'OFFER_RECEIVED', 'OFFER_ACCEPTED', 'PLACED', 'WITHDRAWN'],
        default: 'IN_PROCESS',
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
        default: ['React.js', 'Node.js', 'TypeScript', 'Java', 'Python', 'SQL', 'Git', 'Data Structures', 'Tailwind CSS'],
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
      resumeUrl: { type: String, default: '/sample-resume.pdf' },
      resumeVerified: { type: Boolean, default: true },
      githubUrl: { type: String, default: 'https://github.com/faizaan' },
      linkedinUrl: { type: String, default: 'https://linkedin.com/in/faizaan' },
      portfolioUrl: { type: String, default: '' },
      profileCompletionPercent: { type: Number, default: 85 },
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
