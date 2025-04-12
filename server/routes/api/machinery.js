const express = require("express");
const router = express.Router();
const machineryController = require('../../controllers/machineryController');

// GET all machinery, POST new machinery, HEAD, OPTIONS
router.route('/')
    .get(machineryController.getAllMachinery)
    .post(machineryController.createMachinery)
    .head(machineryController.headMachinery)
    .options(machineryController.getMachineryOptions);

// Search machinery - MUST come BEFORE the /:id route
router.route('/search')
    .get(machineryController.searchMachinery);

// GET, PUT, DELETE, PATCH, HEAD, OPTIONS machinery by ID
router.route('/:id')
    .get(machineryController.getMachineryById)
    .put(machineryController.updateMachinery)      // Full update
    .delete(machineryController.deleteMachinery)
    .patch(machineryController.patchMachinery)     // Partial update
    .head(machineryController.headMachineryById)   // Changed from headMachinery
    .options(machineryController.getMachineryIdOptions);

module.exports = router;
