import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    companyRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    ctc: {
      type: String,
      required: true,
    },
    deadline: {
      type: String,
      required: true,
    },
    logoBg: {
      type: String,
      default: '#eff6ff',
    },
    logoText: {
      type: String,
      default: 'CO',
    },
    tags: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: 'Responsible for designing, building, and deploying cutting-edge enterprise software.',
    },
    eligibility: {
      minCgpa: { type: Number, default: 7.0 },
      allowedBranches: { type: [String], default: ['CSE', 'IT', 'ECE'] },
      backlogsAllowed: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model('Job', jobSchema);
