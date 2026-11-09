import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    recipientRole: {
      type: String,
      enum: ['STUDENT', 'COMPANY', 'TNP', 'TNP_ADMIN', 'SUPER_ADMIN', 'ALL'],
      index: true,
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: ['SYSTEM', 'PERSONAL', 'ROLE_BASED', 'DRIVE_SPECIFIC', 'TNP_BROADCAST', 'GLOBAL'],
      default: 'SYSTEM',
    },
    priority: {
      type: String,
      enum: ['NORMAL', 'HIGH', 'URGENT'],
      default: 'NORMAL',
    },
    entityType: { type: String, default: '' },
    entityId: { type: String, default: '' },
    idempotencyKey: { type: String, default: null },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
    time: {
      type: String,
      default: 'Just now',
    },
    unread: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

notificationSchema.index(
  { idempotencyKey: 1, recipient: 1 },
  { unique: true, partialFilterExpression: { idempotencyKey: { $type: 'string' } } }
);

export const Notification = mongoose.model('Notification', notificationSchema);
