import mongoose from 'mongoose';

const placementCaseSchema = new mongoose.Schema(
  {
    caseNumber: {
      type: String,
      required: true,
      unique: true,
      default: () => `PMS-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentRoll: { type: String, required: true },
    studentName: { type: String, required: true },
    subject: { type: String, required: true },
    category: {
      type: String,
      enum: ['Document Verification', 'Eligibility Discrepancy', 'Attendance Issue', 'Offer Conflict', 'Interview Scheduling', 'General Query'],
      default: 'General Query',
    },
    status: {
      type: String,
      enum: ['OPEN', 'UNDER_REVIEW', 'WAITING_FOR_STUDENT', 'WAITING_FOR_COMPANY', 'RESOLVED', 'CLOSED'],
      default: 'OPEN',
      index: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'],
      default: 'NORMAL',
    },
    description: { type: String, required: true },
    internalNotes: { type: String, default: '' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolutionNotes: { type: String, default: '' },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export const PlacementCase = mongoose.model('PlacementCase', placementCaseSchema);
