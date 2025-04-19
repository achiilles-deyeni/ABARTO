const express = require("express");
const router = express.Router();
const chemicalController = require("../../controllers/chemicalController");

// OPTIONS for collection
router.options("/", chemicalController.getChemicalOptions);

// Collection routes (no ID)
router
  .route("/")
  .get(chemicalController.getAllChemicals)
  .post(chemicalController.createChemical)
  .head(chemicalController.headChemicals);

// Bulk operations
router.post("/bulk", chemicalController.bulkCreateChemicals);
router.delete("/bulk", chemicalController.bulkDeleteChemicals);

// Advanced search endpoint
router.get("/search", chemicalController.searchChemicals);

// Aggregation and specialized endpoints
router.get("/stats", chemicalController.getChemicalStats);
router.get("/by-hazard", chemicalController.getChemicalsByHazardClass);
router.get("/expiring", chemicalController.getExpiringChemicals);

// OPTIONS for individual resource
router.options("/:id", chemicalController.getChemicalIdOptions);

// Individual resource routes (with ID)
router
  .route("/:id")
  .get(chemicalController.getChemicalById)
  .put(chemicalController.updateChemical)
  .delete(chemicalController.deleteChemical)
  .patch(chemicalController.patchChemical)
  .head(chemicalController.headChemical);

module.exports = router;
