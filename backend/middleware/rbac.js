const { hasPermission, ROLES } = require('../utils/roles');
const { protectRoute } = require('./auth');

// Authentication is applied first so RBAC checks always run with a validated user.
const authMiddleware = protectRoute;

const denyAccess = (res, reason = 'Forbidden') => {
  // Basic logging to help track denied access without exposing internals.
  console.warn(`[rbac] ${reason}`);
  return res.status(403).json({ error: 'Forbidden' });
};

// Check if the authenticated user has one of the allowed roles.
const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req?.user || !req.userRole) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!roles.includes(req.userRole)) {
        return denyAccess(res, 'role mismatch');
      }

      return next();
    } catch (error) {
      return denyAccess(res, 'rbac check failed');
    }
  };
};

// Check if the authenticated user has the required permission.
const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req?.user || !req.userRole) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!hasPermission(req.userRole, permission)) {
        return denyAccess(res, 'permission denied');
      }

      return next();
    } catch (error) {
      return denyAccess(res, 'permission check failed');
    }
  };
};

// Admin-only middleware
const requireAdmin = requireRole(ROLES.ADMIN);

// Manager or Admin middleware
const requireManagerOrAdmin = requireRole(ROLES.ADMIN, ROLES.MANAGER);

// Seller or Admin middleware
const requireSellerOrAdmin = requireRole(ROLES.ADMIN, ROLES.SELLER);

module.exports = {
  authMiddleware,
  requireRole,
  requirePermission,
  requireAdmin,
  requireManagerOrAdmin,
  requireSellerOrAdmin,
};
