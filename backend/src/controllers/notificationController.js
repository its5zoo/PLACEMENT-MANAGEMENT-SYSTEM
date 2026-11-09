import { Notification } from '../models/Notification.js';

// @desc    Get user notifications
// @route   GET /api/notifications
export const getNotifications = async (req, res, next) => {
  try {
    const userRole = String(req.user.role || '').toUpperCase();
    const roleAliases = userRole === 'TNP_ADMIN' || userRole === 'SUPER_ADMIN'
      ? ['TNP', userRole]
      : [userRole];
    const notifications = await Notification.find({
      $or: [
        { user: req.user._id },
        { recipient: req.user._id },
        { recipientRole: { $in: roleAliases }, recipient: null },
        { recipientRole: 'ALL', recipient: null },
        { type: 'GLOBAL', recipient: null, user: null },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
export const markNotificationRead = async (req, res, next) => {
  try {
    const userRole = String(req.user.role || '').toUpperCase();
    const roleAliases = userRole === 'TNP_ADMIN' || userRole === 'SUPER_ADMIN'
      ? ['TNP', userRole]
      : [userRole];
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [
          { user: req.user._id },
          { recipient: req.user._id },
          { recipientRole: { $in: roleAliases }, recipient: null },
          { recipientRole: 'ALL', recipient: null },
          { type: 'GLOBAL', recipient: null, user: null },
        ],
      },
      { unread: false },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};
