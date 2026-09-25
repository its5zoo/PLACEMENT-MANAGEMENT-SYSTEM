import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['Placement Drive', 'Mock Test', 'Document Deadline', 'Policy Update', 'General Notice'],
      default: 'General Notice',
    },
    priority: {
      type: String,
      enum: ['NORMAL', 'HIGH', 'URGENT'],
      default: 'NORMAL',
    },
    targetAudience: {
      branches: { type: [String], default: ['ALL'] },
      batches: { type: [String], default: ['ALL'] },
      roles: { type: [String], default: ['STUDENT'] },
      driveRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive' },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: { type: String, default: 'Training & Placement Cell' },
    expiresAt: { type: Date },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Announcement = mongoose.model('Announcement', announcementSchema);
