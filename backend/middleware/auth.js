const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Fail closed when authentication is misconfigured.
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return secret;
};

// Protect routes by validating the JWT and attaching the authenticated user.
const protectRoute = async (req, res, next) => {
  try {
    if (!req || !res || typeof next !== 'function') {
      return;
    }

    const authHeader = req.headers?.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.userId).select('_id name email role');

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.userId = user._id;
    req.userRole = user.role;
    req.user = user;

    return next();
  } catch (error) {
    if (error?.message === 'JWT_SECRET is not configured') {
      return res.status(500).json({ error: 'Authentication service unavailable' });
    }

    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = { protectRoute };
