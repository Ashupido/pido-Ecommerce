const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Build a safe user payload for API responses.
// The password hash should never be exposed to the client.
const buildUserPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// Normalize email input so registration and login behave consistently.
const normalizeEmail = (email) => email?.trim().toLowerCase();

// Create a signed JWT for authenticated users.
// The server must have JWT_SECRET configured; otherwise auth should fail closed.
const createToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is required');
  }

  return jwt.sign(
    {
      userId: user._id || user.id,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: '7d' }
  );
};

const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: message });
};

// Register a new user account.
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!name?.trim() || !normalizedEmail || !password) {
      return sendError(res, 400, 'Name, email, and password are required');
    }

    if (password.length < 6) {
      return sendError(res, 400, 'Password must be at least 6 characters long');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalizedEmail)) {
      return sendError(res, 400, 'Please enter a valid email address');
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return sendError(res, 409, 'An account with this email already exists');
    }

    // Password hashing is handled in the User model pre-save hook in models/User.js.
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'user',
    });

    const token = createToken(user);

    res.status(201).json({
      token,
      user: buildUserPayload(user),
    });
  } catch (error) {
    if (error?.code === 11000) {
      return sendError(res, 409, 'An account with this email already exists');
    }

    if (error.message === 'JWT_SECRET is required') {
      return sendError(res, 500, 'Authentication is currently unavailable');
    }

    // Avoid leaking internal details in production responses.
    return sendError(res, 500, 'Registration failed');
  }
};

// Login an existing user and return a JWT.
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const token = createToken(user);

    res.status(200).json({
      token,
      user: buildUserPayload(user),
    });
  } catch (error) {
    if (error.message === 'JWT_SECRET is required') {
      return sendError(res, 500, 'Authentication is currently unavailable');
    }

    // Avoid leaking internal details in production responses.
    return sendError(res, 500, 'Login failed');
  }
};

module.exports = {
  registerUser,
  loginUser,
  createToken,
  buildUserPayload,
  normalizeEmail,
};
