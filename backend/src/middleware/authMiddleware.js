import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_tnp_placement_2025');
      req.user = await User.findById(decoded.id).select('-password');
      if (req.user) return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  // Development convenience: Check x-acting-role header
  const actingRole = req.headers['x-acting-role'] ? String(req.headers['x-acting-role']).toUpperCase() : null;

  try {
    let query = {};
    if (actingRole) {
      if (actingRole === 'TNP' || actingRole === 'TNP_ADMIN') {
        query = { role: { $in: ['TNP', 'TNP_ADMIN', 'tpo', 'admin'] } };
      } else if (actingRole === 'COMPANY') {
        query = { role: { $in: ['COMPANY', 'recruiter'] } };
      } else {
        query = { role: { $in: ['STUDENT', 'student'] } };
      }
    } else {
      query = { role: { $in: ['STUDENT', 'student'] } };
    }

    const defaultUser = await User.findOne(query).select('-password');
    if (defaultUser) {
      req.user = defaultUser;
      return next();
    }
  } catch (err) {
    // proceed
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
