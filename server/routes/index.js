const express = require('express');
const router = express.Router();

// Import route modules
const employeeRoutes = require('./api/employee');

// Mount routes
router.use('/api/employees', employeeRoutes);

// Add other routes as they become available
// router.use('/api/admin', adminRoutes);
// router.use('/api/chemicals', chemicalRoutes);
// etc.

module.exports = router;
