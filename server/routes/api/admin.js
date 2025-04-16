const express = require("express");
const router = express.Router();
const adminController = require('../../controllers/adminController');
const { protect, authorize } = require('../../middleware/auth');

// Apply protect middleware to all routes in this file
// If specific routes should be public, apply middleware individually
router.use(protect);

// Optional: Apply role-based authorization (example: only allow users with 'superadmin' role)
// router.use(authorize('superadmin'));

// GET all admins, POST new admin, HEAD, OPTIONS
router.route('/')
    .get(adminController.getAllAdmins)
    .post(adminController.createAdmin)
    .head(adminController.headAdmins)
    .options(adminController.getAdminOptions);

// Search admins - MUST come BEFORE the /:id route
router.route('/search')
    .get(adminController.searchAdmins);

// GET, PUT, DELETE, PATCH, HEAD, OPTIONS admin by ID
router.route('/:id')
    .get(adminController.getAdminById)
    .put(adminController.updateAdmin)
    .delete(adminController.deleteAdmin)
    .patch(adminController.patchAdmin)
    .head(adminController.headAdmin)
    .options(adminController.getAdminIdOptions);

module.exports = router;
