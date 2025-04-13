const express = require("express");
const router = express.Router();
const safetyController = require('../../controllers/safetyController'); // NOTE: Controller needs to be created

// Assuming this relates to safety procedures, incidents, or checks

// GET all safety items, POST new item, HEAD, OPTIONS
router.route('/')
    .get(safetyController.getAllSafetyItems)    // Placeholder
    .post(safetyController.createSafetyItem)   // Placeholder
    .head(safetyController.headSafetyItems)    // Placeholder
    .options(safetyController.getSafetyOptions); // Placeholder

// Search safety items - MUST come BEFORE the /:id route
router.route('/search')
    .get(safetyController.searchSafetyItems);   // Placeholder

// GET, PUT, DELETE, PATCH, HEAD, OPTIONS safety item by ID
router.route('/:id')
    .get(safetyController.getSafetyItemById)   // Placeholder
    .put(safetyController.updateSafetyItem)   // Placeholder
    .delete(safetyController.deleteSafetyItem) // Placeholder
    .patch(safetyController.patchSafetyItem)   // Placeholder
    .head(safetyController.headSafetyItem)     // Placeholder
    .options(safetyController.getSafetyIdOptions); // Placeholder

module.exports = router;
