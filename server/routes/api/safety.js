const express = require("express");
const router = express.Router();
const safetyController = require("../../controllers/safetyController");

// OPTIONS for collection
router.options("/", safetyController.getSafetyOptions);

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

module.exports = router;
