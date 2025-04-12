const express = require("express");
const router = express.Router();
const adminController = require('../../controllers/adminController');

// GET all admins, POST new admin, HEAD, OPTIONS
router.route('/')
    .get(adminController.getAllAdmins)
    .post(adminController.createAdmin) // Changed from /register-admin
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
    .head(adminController.headAdminById)
    .options(adminController.getAdminIdOptions);

module.exports = router;
