import { Notification } from '../models/Notification.js';

export class NotificationService {
  static async send({
    title,
    message,
    type = 'SYSTEM',
    priority = 'NORMAL',
    sender = null,
    recipient = null,
    recipientRole = 'STUDENT',
    entityType = null,
    entityId = null,
    idempotencyKey = null,
  }) {
    try {
      if (idempotencyKey) {
        const existing = await Notification.findOne({ idempotencyKey, recipient });
        if (existing) return existing;
      }

      return await Notification.create({
        title,
        message,
        type,
        priority,
        sender,
        recipient,
        recipientRole,
        entityType,
        entityId: entityId ? String(entityId) : null,
        idempotencyKey,
        time: 'Just now',
        unread: true,
      });
    } catch (err) {
      console.error('Notification creation error:', err.message);
      return null;
    }
  }

  static async broadcast({
    title,
    message,
    recipients = [],
    recipientRole = 'STUDENT',
    priority = 'NORMAL',
    type = 'TNP_BROADCAST',
    sender = null,
  }) {
    try {
      const docs = recipients.map((rId) => ({
        title,
        message,
        type,
        priority,
        sender,
        recipient: rId,
        recipientRole,
        time: 'Just now',
        unread: true,
      }));

      if (docs.length > 0) {
        return await Notification.insertMany(docs);
      }
      return [];
    } catch (err) {
      console.error('Broadcast notification error:', err.message);
      return [];
    }
  }
}
