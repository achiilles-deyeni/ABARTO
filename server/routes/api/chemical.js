const express = require("express");
const router = express.Router();
<<<<<<< HEAD
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
=======
const chemicalController = require('../../controllers/chemicalController');
const { protect } = require('../../middleware/authMiddleware');

// Base route: /api/chemicals
router.route('/')
    .get(protect, chemicalController.getAllChemicals)
    .post(protect, chemicalController.createChemical)
    .head(protect, chemicalController.headChemicals)
    .options(chemicalController.getChemicalOptions);

// Search route: /api/chemicals/search
router.route('/search')
    .get(protect, chemicalController.searchChemicals);

// Single chemical route: /api/chemicals/:id
router.route('/:id')
    .get(protect, chemicalController.getChemicalById)
    .put(protect, chemicalController.updateChemical)
    .patch(protect, chemicalController.patchChemical)
    .delete(protect, chemicalController.deleteChemical)
    .head(protect, chemicalController.headChemical)
    .options(chemicalController.getChemicalIdOptions);
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11

module.exports = router;
