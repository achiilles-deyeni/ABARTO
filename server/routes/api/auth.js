const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');

// POST /api/auth/register
router.post('/register', authController.registerAdmin);

// @route   POST /api/auth/login
// @desc    Authenticate user (Admin) and return token
// @access  Public
router.post('/login', authController.loginUser);

// Optional: Add routes for password reset, token refresh, etc.

module.exports = router; 
