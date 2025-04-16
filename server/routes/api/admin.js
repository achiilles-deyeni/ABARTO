const express = require("express");
const router = express.Router();
const adminController = require('../../controllers/adminController'); // NOTE: Controller needs to be created

// GET all chemicals, POST new chemical, HEAD, OPTIONS
router.route('/')
    .get(adminController.getAllAdmins)    // Placeholder
    .post(adminController.createAdmin)   // Placeholder
    .head(adminController.headAdmins)    // Placeholder
    .options(adminController.getAdminOptions); // Placeholder

// Search admins - MUST come BEFORE the /:id route
router.route('/search')
    .get(adminController.searchAdmins);   // Placeholder

// GET, PUT, DELETE, PATCH, HEAD, OPTIONS admin by ID
router.route('/:id')
    .get(adminController.getAdminById)   // Placeholder
    .put(adminController.updateAdmin)   // Placeholder
    .delete(adminController.deleteAdmin) // Placeholder
    .patch(adminController.patchAdmin)   // Placeholder
    .head(adminController.headAdminById)     // Placeholder
    .options(adminController.getAdminIdOptions); // Placeholder

module.exports = router;
