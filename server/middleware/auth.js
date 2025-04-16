const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const securityService = require('../services/securityService');
const Admin = require('../models/admin'); // Adjust if other models can log in

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token using the security service
      const decoded = await securityService.verifyToken(token);

      if (!decoded || !decoded.id) {
          return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
      }

      // Get user from the token payload ID
      // Ensure password is not selected
      req.user = await Admin.findById(decoded.id).select('-password');
      // Add logic here if other user types (e.g., Employee) can log in

      if (!req.user) {
          // User associated with token no longer exists
          return res.status(401).json({ success: false, error: 'Not authorized, user not found' });
      }

      next(); // Proceed to the protected route
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
});

// Optional: Middleware for role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) { // Assuming user object attached by protect middleware has role
        return res.status(403).json({ success: false, error: 'User role not found, forbidden' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: `User role ${req.user.role} is not authorized to access this route` });
    }
    next();
  };
};

module.exports = { protect, authorize };
