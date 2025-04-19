const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const safetyController = require("../../controllers/safetyController");
=======
const safetyController = require('../../controllers/safetyController'); // NOTE: Controller needs to be created
const { protect } = require('../../middleware/authMiddleware');
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11

// OPTIONS for collection
router.options("/", safetyController.getSafetyOptions);

<<<<<<< HEAD
// Collection routes (no ID)
router
  .route("/")
  .get(safetyController.getAllSafetyItems)
  .post(safetyController.createSafetyItem)
  .head(safetyController.headSafetyItems);

// Advanced search endpoint
router.get("/search", safetyController.searchSafetyItems);

// Maintenance specific endpoints
router.get(
  "/due-for-inspection",
  safetyController.getEquipmentDueForInspection
);
router.get("/maintenance-report", safetyController.generateMaintenanceReport);

// Record maintenance for a specific equipment item
router.post("/:id/maintenance", safetyController.recordMaintenance);

// OPTIONS for individual resource
router.options("/:id", safetyController.getSafetyIdOptions);

// Individual resource routes (with ID)
router
  .route("/:id")
  .get(safetyController.getSafetyItemById)
  .put(safetyController.updateSafetyItem)
  .delete(safetyController.deleteSafetyItem)
  .patch(safetyController.patchSafetyItem)
  .head(safetyController.headSafetyItem);
=======
// GET all safety items, POST new item, HEAD, OPTIONS
router.route('/')
    .get(protect, safetyController.getAllSafetyItems)    // Placeholder
    .post(protect, safetyController.createSafetyItem)   // Placeholder
    .head(protect, safetyController.headSafetyItems)    // Placeholder
    .options(safetyController.getSafetyOptions); // Placeholder

// Search safety items - MUST come BEFORE the /:id route
router.route('/search')
    .get(protect, safetyController.searchSafetyItems);   // Placeholder

// GET, PUT, DELETE, PATCH, HEAD, OPTIONS safety item by ID
router.route('/:id')
    .get(protect, safetyController.getSafetyItemById)   // Placeholder
    .put(protect, safetyController.updateSafetyItem)   // Placeholder
    .delete(protect, safetyController.deleteSafetyItem) // Placeholder
    .patch(protect, safetyController.patchSafetyItem)   // Placeholder
    .head(protect, safetyController.headSafetyItem)     // Placeholder
    .options(safetyController.getSafetyIdOptions); // Placeholder
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11

module.exports = router;
