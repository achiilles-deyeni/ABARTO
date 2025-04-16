const express = require('express');
const router = express.Router();

// Import route modules
const employeeRoutes = require('./api/employee');
const adminRoutes = require('./api/admin');
const productRoutes = require('./api/products');
const materialRoutes = require('./api/material');
const chemicalRoutes = require('./api/chemical');
const safetyRoutes = require('./api/safety');
const machineryRoutes = require('./api/machinery');
const supplyRoutes = require('./api/supply');
const wholesaleRoutes = require('./api/wholesale');

// Mount routes
router.use('/api/employees', employeeRoutes);
router.use('/api/admins', adminRoutes);
router.use('/api/products', productRoutes);
router.use('/api/materials', materialRoutes);
router.use('/api/chemicals', chemicalRoutes);
router.use('/api/safety', safetyRoutes);
router.use('/api/machinery', machineryRoutes);
router.use('/api/supplies', supplyRoutes);
router.use('/api/wholesale', wholesaleRoutes);

// Add other routes as they become available
// router.use('/api/admin', adminRoutes);
// router.use('/api/chemicals', chemicalRoutes);
// etc.

module.exports = router;
