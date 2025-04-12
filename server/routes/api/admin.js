const express = require("express");
const router = express.Router();
const adminController = require('../../controllers/adminController');
const { protect } = require('../../middleware/authMiddleware');

// GET all admins, POST new admin, HEAD, OPTIONS
router.route('/')
    .get(protect, adminController.getAllAdmins)
    .head(protect, adminController.headAdmins)
    .options(adminController.getAdminOptions);

// Search admins - MUST come BEFORE the /:id route
router.route('/search')
    .get(protect, adminController.searchAdmins);

// GET, PUT, DELETE, PATCH, HEAD, OPTIONS admin by ID
router.route('/:id')
    .get(protect, adminController.getAdminById)
    .put(protect, adminController.updateAdmin)
    .delete(protect, adminController.deleteAdmin)
    .patch(protect, adminController.patchAdmin)
    .head(protect, adminController.headAdminById)
    .options(adminController.getAdminIdOptions);

module.exports = router;
