const express = require("express");
const router = express.Router();
<<<<<<< HEAD
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
=======
const machineryController = require('../../controllers/machineryController');
const { protect } = require('../../middleware/authMiddleware');

// Base route: /api/machinery
router.route('/')
    .get(machineryController.getAllMachineryParts)
    .post(machineryController.createMachineryPart)
    .head(machineryController.headMachineryParts)
    .options(machineryController.getMachineryPartOptions);

// Search route: /api/machinery/search
router.route('/search')
    .get(machineryController.searchMachineryParts);

// Single part route: /api/machinery/:id
router.route('/:id')
    .get(machineryController.getMachineryPartById)
    .put(machineryController.updateMachineryPart)
    .patch(machineryController.patchMachineryPart)
    .delete(machineryController.deleteMachineryPart)
    .head(machineryController.headMachineryPart)
    .options(machineryController.getMachineryPartIdOptions);
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11

module.exports = router;
