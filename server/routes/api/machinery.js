const express = require("express");
const router = express.Router();
const machineryController = require('../../controllers/machineryController');
const { protect } = require('../../middleware/authMiddleware');

// GET all machinery, POST new machinery, HEAD, OPTIONS
router.route('/')
    .get(protect, machineryController.getAllMachinery)
    .post(protect, machineryController.createMachinery)
    .head(protect, machineryController.headMachinery)
    .options(machineryController.getMachineryOptions);

// Search machinery - MUST come BEFORE the /:id route
router.route('/search')
    .get(protect, machineryController.searchMachinery);

// GET, PUT, DELETE, PATCH, HEAD, OPTIONS machinery by ID
router.route('/:id')
    .get(protect, machineryController.getMachineryById)
    .put(protect, machineryController.updateMachinery)      // Full update
    .delete(protect, machineryController.deleteMachinery)
    .patch(protect, machineryController.patchMachinery)     // Partial update
    .head(protect, machineryController.headMachineryById)   // Changed from headMachinery
    .options(machineryController.getMachineryIdOptions);

module.exports = router;
