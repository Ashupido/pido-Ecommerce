const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

// Create a new account.
router.post('/register', registerUser);

// Sign in and receive a JWT.
router.post('/login', loginUser);

module.exports = router;