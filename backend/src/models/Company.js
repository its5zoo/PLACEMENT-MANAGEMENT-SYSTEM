import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    legalName: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    headOffice: {
      type: String,
      default: 'Bengaluru, India',
    },
    locations: {
      type: [String],
      default: ['Bengaluru', 'Hyderabad', 'Pune', 'Noida'],
    },
    logoText: {
      type: String,
      default: 'CO',
    },
    logoBg: {
      type: String,
      default: '#eff6ff',
    },
    // HR & Contact Person
    hrName: {
      type: String,
      default: 'Recruitment Team',
    },
    hrDesignation: {
      type: String,
      default: 'Campus Lead',
    },
    hrEmail: {
      type: String,
      default: '',
    },
    hrContact: {
      type: String,
      default: '+91 98000 12345',
    },
    // Verification Status Workflow
    verificationStatus: {
      type: String,
      enum: ['REGISTERED', 'PROFILE_SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED'],
      default: 'VERIFIED',
    },
    verificationNotes: {
      type: String,
      default: '',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
    activeDrives: {
      type: Number,
      default: 1,
    },
    avgPackage: {
      type: String,
      default: 'Rs. 18 LPA',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Company = mongoose.model('Company', companySchema);
