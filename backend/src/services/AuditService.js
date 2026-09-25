import { AuditLog } from '../models/AuditLog.js';

export class AuditService {
  static async log({
    actor,
    actorName,
    actorRole = 'SYSTEM',
    action,
    entityType,
    entityId,
    oldValue,
    newValue,
    reason,
    ipAddress = '127.0.0.1',
    userAgent = '',
    metadata = {},
  }) {
    try {
      return await AuditLog.create({
        actor: actor || null,
        actorName: actorName || 'System',
        actorRole: actorRole || 'SYSTEM',
        action,
        entityType,
        entityId: String(entityId),
        oldValue: oldValue || null,
        newValue: newValue || null,
        reason: reason || '',
        ipAddress,
        userAgent,
        metadata,
      });
    } catch (err) {
      console.error('AuditLog write error:', err.message);
      // do not throw to prevent blocking main transaction if logging fails
      return null;
    }
  }
}
