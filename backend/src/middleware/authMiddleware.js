import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findOne({
        _id: decoded.id,
        isActive: true,
        isDeleted: false,
      }).select('-password');
      if (req.user) return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  // Explicitly opt-in demo authentication; never permit header impersonation in production.
  const demoAuthEnabled = process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEMO_AUTH === 'true';
  if (!demoAuthEnabled) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  const actingRole = req.headers['x-acting-role'] ? String(req.headers['x-acting-role']).toUpperCase() : null;

  try {
    let query = { isActive: true, isDeleted: false };
    if (actingRole) {
      if (actingRole === 'TNP' || actingRole === 'TNP_ADMIN') {
        query.role = { $in: ['TNP', 'TNP_ADMIN', 'tpo', 'admin'] };
      } else if (actingRole === 'COMPANY') {
        query.role = { $in: ['COMPANY', 'recruiter'] };
      } else {
        query.role = { $in: ['STUDENT', 'student'] };
      }
    } else {
      query.role = { $in: ['STUDENT', 'student'] };
    }

    const defaultUser = await User.findOne(query).select('-password');
    if (defaultUser) {
      req.user = defaultUser;
      return next();
    }
  } catch (err) {
    return next(err);
  }

  return res.status(401).json({ success: false, message: 'Not authorized, no token' });
};

export const authorize = (...roles) => {
  const normalizedRoles = roles.map((r) => r.toUpperCase());
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const userRole = (req.user.role || '').toUpperCase();

    // SUPER_ADMIN has god-mode access
    if (userRole === 'SUPER_ADMIN') {
      return next();
    }

    // Role mapping compatibility: TPO -> TNP, ADMIN -> TNP_ADMIN
    const effectiveRoles = [userRole];
    if (userRole === 'TPO') effectiveRoles.push('TNP');
    if (userRole === 'ADMIN') effectiveRoles.push('TNP', 'TNP_ADMIN');
    if (userRole === 'TNP') effectiveRoles.push('TPO');
    if (userRole === 'TNP_ADMIN') effectiveRoles.push('TNP', 'TPO', 'ADMIN');

    const hasPermission = normalizedRoles.some((r) => effectiveRoles.includes(r));
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `User role '${userRole}' is not authorized to access this resource`,
      });
    }
    next();
  };
};
