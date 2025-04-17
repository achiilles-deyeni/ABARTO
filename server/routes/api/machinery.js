const express = require("express");
const router = express.Router();
const machineryController = require("../../controllers/machineryController");

// Route prefixes:
// GET /api/machinery
// POST /api/machinery
// OPTIONS /api/machinery
router
  .route("/")
  .get(machineryController.getAllMachinery)
  .post(machineryController.createMachinery)
  .head(machineryController.headMachinery)
  .options(machineryController.getMachineryOptions);

// Bulk operations
router
  .route("/bulk")
  .post(machineryController.bulkCreateMachinery)
  .delete(machineryController.bulkDeleteMachinery);

// Search and aggregate routes
router.get("/search", machineryController.searchMachinery);
router.get("/stats", machineryController.getMachineryStats);
router.get("/by-type", machineryController.getMachineryByType);
router.get("/low-stock", machineryController.getLowStockMachinery);

// Individual machinery routes:
// GET /api/machinery/:id
// PUT /api/machinery/:id
// DELETE /api/machinery/:id
// PATCH /api/machinery/:id
// HEAD /api/machinery/:id
// OPTIONS /api/machinery/:id
router
  .route("/:id")
  .get(machineryController.getMachineryById)
  .put(machineryController.updateMachinery)
  .delete(machineryController.deleteMachinery)
  .patch(machineryController.patchMachinery)
  .head(machineryController.headMachineryById)
  .options(machineryController.getMachineryIdOptions);

module.exports = router;
