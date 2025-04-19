const express = require("express");
const router = express.Router();
const safetyController = require("../../controllers/safetyController"); // NOTE: Controller needs to be created
const { protect } = require("../../middleware/authMiddleware");

// OPTIONS for collection
router.options("/", safetyController.getSafetyOptions);

// GET all safety items, POST new item, HEAD, OPTIONS
router
  .route("/")
  .get(protect, safetyController.getAllSafetyItems) // Placeholder
  .post(protect, safetyController.createSafetyItem) // Placeholder
  .head(protect, safetyController.headSafetyItems) // Placeholder
  .options(safetyController.getSafetyOptions); // Placeholder

// Search safety items - MUST come BEFORE the /:id route
router.route("/search").get(protect, safetyController.searchSafetyItems); // Placeholder

// GET, PUT, DELETE, PATCH, HEAD, OPTIONS safety item by ID
router
  .route("/:id")
  .get(protect, safetyController.getSafetyItemById) // Placeholder
  .put(protect, safetyController.updateSafetyItem) // Placeholder
  .delete(protect, safetyController.deleteSafetyItem) // Placeholder
  .patch(protect, safetyController.patchSafetyItem) // Placeholder
  .head(protect, safetyController.headSafetyItem) // Placeholder
  .options(safetyController.getSafetyIdOptions); // Placeholder

module.exports = router;
