import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drive',
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    ctc: { type: String, required: true },
    baseSalary: { type: String, default: '' },
    variablePay: { type: String, default: '' },
    location: { type: String, default: 'India' },
    joiningDate: { type: String, default: 'July 2027' },
    offerDate: { type: Date, default: Date.now },
    offerLetterUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['DRAFT', 'RELEASED', 'VIEWED', 'ACCEPTED', 'DECLINED', 'WITHDRAWN'],
      default: 'RELEASED',
      index: true,
    },
    responseDate: { type: Date },
    declineReason: { type: String, default: '' },
    remarks: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

offerSchema.index({ student: 1, drive: 1 }, { unique: true });

export const Offer = mongoose.model('Offer', offerSchema);
