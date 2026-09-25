import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    threadId: {
      type: String,
      required: true,
      index: true,
    },
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drive',
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderRole: {
      type: String,
      enum: ['TNP', 'COMPANY', 'STUDENT'],
      required: true,
    },
    senderName: { type: String, required: true },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    receiverRole: { type: String },
    message: { type: String, required: true },
    attachments: [{ fileName: String, fileUrl: String }],
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  { timestamps: true }
);

export const Communication = mongoose.model('Communication', messageSchema);
