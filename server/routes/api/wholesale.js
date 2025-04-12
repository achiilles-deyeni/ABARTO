const express = require("express");
const router = express.Router();
const wholesaleController = require('../../controllers/wholesaleController'); // NOTE: Controller needs to be created
const { protect } = require('../../middleware/authMiddleware');

// GET all wholesale records, POST new record, HEAD, OPTIONS
router.route('/')
    .get(protect, wholesaleController.getAllWholesaleRecords) // Placeholder
    .post(protect, wholesaleController.createWholesaleRecord) // Placeholder
    .head(protect, wholesaleController.headWholesaleRecords)  // Placeholder
    .options(wholesaleController.getWholesaleOptions); // Placeholder

// Search wholesale records - MUST come BEFORE the /:id route
router.route('/search')
    .get(protect, wholesaleController.searchWholesaleRecords); // Placeholder

// GET, PUT, DELETE, PATCH, HEAD, OPTIONS wholesale record by ID
router.route('/:id')
    .get(protect, wholesaleController.getWholesaleRecordById) // Placeholder
    .put(protect, wholesaleController.updateWholesaleRecord)  // Placeholder
    .delete(protect, wholesaleController.deleteWholesaleRecord)// Placeholder
    .patch(protect, wholesaleController.patchWholesaleRecord) // Placeholder
    .head(protect, wholesaleController.headWholesaleRecord)   // Placeholder
    .options(wholesaleController.getWholesaleIdOptions); // Placeholder

module.exports = router;
