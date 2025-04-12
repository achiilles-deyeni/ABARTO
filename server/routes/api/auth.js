const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');

// POST /api/auth/register
router.post('/register', authController.registerAdmin);

// POST /api/auth/login
router.post('/login', authController.loginAdmin);

// Optional: Add routes for password reset, token refresh, etc.

module.exports = router; 