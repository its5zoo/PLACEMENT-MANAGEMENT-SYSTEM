import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ownerRole: {
      type: String,
      enum: ['STUDENT', 'COMPANY'],
      default: 'STUDENT',
    },
    companyRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'Resume',
        '10th Marksheet',
        '12th Marksheet',
        'Diploma Marksheet',
        'Semester Marksheet',
        'College ID',
        'Certificate',
        'Internship Certificate',
        'Offer Letter',
        'Company Registration',
        'Other',
      ],
      required: true,
    },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: String, default: '1.2 MB' },
    mimeType: { type: String, default: 'application/pdf' },
    status: {
      type: String,
      enum: ['UPLOADED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'REPLACEMENT_REQUIRED'],
      default: 'UPLOADED',
      index: true,
    },
    rejectionReason: { type: String, default: '' },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: { type: Date },
    version: { type: Number, default: 1 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Document = mongoose.model('Document', documentSchema);
