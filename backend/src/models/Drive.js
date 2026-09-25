import mongoose from 'mongoose';

const roundSchema = new mongoose.Schema({
  roundIndex: { type: Number, required: true },
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['Online Assessment', 'Coding Test', 'Technical Interview', 'HR Interview', 'Group Discussion', 'Final Round'],
    default: 'Technical Interview',
  },
  date: { type: String, default: '' },
  startTime: { type: String, default: '10:00 AM' },
  endTime: { type: String, default: '12:00 PM' },
  location: { type: String, default: 'Auditorium Block A / Online' },
  meetingLink: { type: String, default: '' },
  instructions: { type: String, default: '' },
  status: {
    type: String,
    enum: ['SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'],
    default: 'SCHEDULED',
  },
});

const driveSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    companyName: { type: String, required: true },
    // Detailed Compensation
    ctc: { type: String, required: true },
    baseSalary: { type: String, default: '' },
    variablePay: { type: String, default: '' },
    location: { type: String, required: true },
    workMode: { type: String, enum: ['On-site', 'Hybrid', 'Remote'], default: 'On-site' },
    employmentType: { type: String, enum: ['Full Time', 'Internship + PPO', 'Internship'], default: 'Full Time' },
    applicationDeadline: { type: Date, required: true },
    deadlineFormatted: { type: String, default: '' },
    description: { type: String, default: '' },
    responsibilities: { type: [String], default: [] },
    // Strict Deterministic Eligibility Criteria
    eligibility: {
      minCgpa: { type: Number, default: 7.0 },
      min10thPercentage: { type: Number, default: 60.0 },
      min12thPercentage: { type: Number, default: 60.0 },
      minDiplomaPercentage: { type: Number, default: 60.0 },
      maxBacklogs: { type: Number, default: 2 },
      maxActiveBacklogs: { type: Number, default: 0 },
      minAttendance: { type: Number, default: 75.0 },
      allowedBranches: { type: [String], default: ['CSE', 'IT', 'ECE'] },
      allowedPrograms: { type: [String], default: ['B.Tech', 'M.Tech', 'MCA'] },
      allowedGraduationYears: { type: [Number], default: [2027, 2026, 2025] },
      requiredSkills: { type: [String], default: ['Java', 'SQL', 'Data Structures'] },
      preferredSkills: { type: [String], default: ['React', 'Cloud', 'System Design'] },
      resumeRequired: { type: Boolean, default: true },
    },
    // Hiring Selection Process
    rounds: [roundSchema],
    requiredDocuments: {
      type: [String],
      default: ['Resume', '10th Marksheet', '12th Marksheet', 'Semester Marksheets'],
    },
    // Complete Placement Drive Lifecycle State Machine
    status: {
      type: String,
      enum: [
        'DRAFT',
        'SUBMITTED',
        'UNDER_REVIEW',
        'NEEDS_CORRECTION',
        'APPROVED',
        'PUBLISHED',
        'APPLICATIONS_OPEN',
        'APPLICATIONS_CLOSED',
        'SHORTLISTING',
        'INTERVIEWING',
        'RESULT_PENDING',
        'COMPLETED',
        'CANCELLED',
        'ARCHIVED',
      ],
      default: 'APPROVED',
      index: true,
    },
    // TNP Review & Approval Matrix
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    rejectionReason: { type: String, default: '' },
    correctionComments: { type: String, default: '' },
    internalTnpNotes: { type: String, default: '' }, // Strictly private to TNP
    criteriaVersion: { type: Number, default: 1 },
    logoBg: { type: String, default: '#eff6ff' },
    logoText: { type: String, default: 'CO' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Drive = mongoose.model('Drive', driveSchema);
