import mongoose from 'mongoose';

const roundResultSchema = new mongoose.Schema({
  roundIndex: { type: Number, required: true },
  roundName: { type: String, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'CLEARED', 'NOT_CLEARED', 'ABSENT', 'WITHDRAWN'],
    default: 'PENDING',
  },
  score: { type: String, default: '' },
  feedback: { type: String, default: '' },
  evaluatedAt: { type: Date },
});

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      index: true,
    },
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drive',
      index: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    logo: { type: String, default: 'CO' },
    logoBg: { type: String, default: '#ffffff' },
    location: { type: String, default: 'India' },
    ctc: { type: String, default: 'Competitive' },
    // Strict Application State Machine
    status: {
      type: String,
      enum: [
        'DRAFT',
        'APPLIED',
        'UNDER_REVIEW',
        'SHORTLISTED',
        'ROUND_1',
        'ROUND_2',
        'ROUND_3',
        'FINAL_INTERVIEW',
        'SELECTED',
        'OFFERED',
        'ACCEPTED',
        'DECLINED',
        'REJECTED',
        'WITHDRAWN',
        'In-Progress', // compatibility with legacy UI
      ],
      default: 'APPLIED',
      index: true,
    },
    appliedDate: {
      type: String,
      default: () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    // Immutable snapshot taken at application submission
    eligibilitySnapshot: {
      cgpa: Number,
      attendancePercentage: Number,
      activeBacklogs: Number,
      branch: String,
      graduationYear: Number,
      matchedSkills: [String],
      isEligible: Boolean,
      matchPercentage: Number,
      evaluatedAt: { type: Date, default: Date.now },
    },
    currentRoundIndex: { type: Number, default: 0 },
    currentRoundName: { type: String, default: 'Application Review' },
    roundResults: [roundResultSchema],
    remarks: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

applicationSchema.pre('validate', function (next) {
  if (!this.job && !this.drive) {
    return next(new Error('An application must reference a job or a drive'));
  }
  next();
});

// Prevent duplicate applications while supporting both legacy jobs and placement drives.
applicationSchema.index(
  { student: 1, drive: 1 },
  { unique: true, partialFilterExpression: { drive: { $type: 'objectId' } } }
);
applicationSchema.index(
  { student: 1, job: 1 },
  { unique: true, partialFilterExpression: { job: { $type: 'objectId' } } }
);

export const Application = mongoose.model('Application', applicationSchema);
