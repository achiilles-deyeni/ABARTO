<<<<<<< HEAD
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const securityService = require("../services/securityService");
const Admin = require("../models/admin"); // Adjust if other models can log in
=======
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const securityService = require('../services/securityService');
const Admin = require('../models/admin'); // Adjust if other models can log in
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token)
  if (
    req.headers.authorization &&
<<<<<<< HEAD
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
=======
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11

      // Verify token using the security service
      const decoded = await securityService.verifyToken(token);

      if (!decoded || !decoded.id) {
<<<<<<< HEAD
        return res
          .status(401)
          .json({ success: false, error: "Not authorized, token failed" });
=======
          return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11
      }

      // Get user from the token payload ID
      // Ensure password is not selected
<<<<<<< HEAD
      req.user = await Admin.findById(decoded.id).select("-password");
      // Add logic here if other user types (e.g., Employee) can log in

      if (!req.user) {
        // User associated with token no longer exists
        return res
          .status(401)
          .json({ success: false, error: "Not authorized, user not found" });
=======
      req.user = await Admin.findById(decoded.id).select('-password');
      // Add logic here if other user types (e.g., Employee) can log in

      if (!req.user) {
          // User associated with token no longer exists
          return res.status(401).json({ success: false, error: 'Not authorized, user not found' });
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11
      }

      next(); // Proceed to the protected route
    } catch (error) {
<<<<<<< HEAD
      console.error("Auth Middleware Error:", error);
      return res
        .status(401)
        .json({ success: false, error: "Not authorized, token failed" });
=======
      console.error('Auth Middleware Error:', error);
      return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11
    }
  }

  if (!token) {
<<<<<<< HEAD
    return res
      .status(401)
      .json({ success: false, error: "Not authorized, no token" });
=======
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11
  }
});

// Optional: Middleware for role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
<<<<<<< HEAD
    if (!req.user || !req.user.role) {
      // Assuming user object attached by protect middleware has role
      return res
        .status(403)
        .json({ success: false, error: "User role not found, forbidden" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`,
      });
=======
    if (!req.user || !req.user.role) { // Assuming user object attached by protect middleware has role
        return res.status(403).json({ success: false, error: 'User role not found, forbidden' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: `User role ${req.user.role} is not authorized to access this route` });
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11
    }
    next();
  };
};

module.exports = { protect, authorize };
