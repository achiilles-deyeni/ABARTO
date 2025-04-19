const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/adminController");
const { protect, authorize } = require("../../middleware/auth");

router.use(protect);

// OPTIONS for collection
router.options("/", adminController.getAdminOptions);

// HEAD for collection
router.head("/", adminController.headAdmins);

// GET all admins with filtering, pagination, sorting
router.get("/", adminController.getAllAdmins);

// POST - Create new admin
router.post("/", adminController.createAdmin);

// Bulk operations
router.post("/bulk", adminController.bulkCreateAdmins);
router.delete("/bulk", adminController.bulkDeleteAdmins);

// Advanced search
router.get("/search", adminController.searchAdmins);

// Analytics and aggregation endpoints
router.get("/stats", adminController.getAdminStats);

// OPTIONS for single item
router.options("/:id", adminController.getAdminIdOptions);

// HEAD for single item
router.head("/:id", adminController.headAdmin);

// Single admin routes
router.get("/:id", adminController.getAdminById);
router.put("/:id", adminController.updateAdmin);
router.patch("/:id", adminController.patchAdmin);
router.delete("/:id", adminController.deleteAdmin);

module.exports = router;
