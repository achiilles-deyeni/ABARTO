const express = require("express");
const router = express.Router();
const wholesaleController = require('../../controllers/wholesaleController'); // NOTE: Controller needs to be created

// GET all wholesale records, POST new record, HEAD, OPTIONS
router.route('/')
    .get(wholesaleController.getAllWholesaleRecords) // Placeholder
    .post(wholesaleController.createWholesaleRecord) // Placeholder
    .head(wholesaleController.headWholesaleRecords)  // Placeholder
    .options(wholesaleController.getWholesaleOptions); // Placeholder

// Search wholesale records - MUST come BEFORE the /:id route
router.route('/search')
    .get(wholesaleController.searchWholesaleRecords); // Placeholder

// GET, PUT, DELETE, PATCH, HEAD, OPTIONS wholesale record by ID
router.route('/:id')
    .get(wholesaleController.getWholesaleRecordById) // Placeholder
    .put(wholesaleController.updateWholesaleRecord)  // Placeholder
    .delete(wholesaleController.deleteWholesaleRecord)// Placeholder
    .patch(wholesaleController.patchWholesaleRecord) // Placeholder
    .head(wholesaleController.headWholesaleRecord)   // Placeholder
    .options(wholesaleController.getWholesaleIdOptions); // Placeholder

module.exports = router;
