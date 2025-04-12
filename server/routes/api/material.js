const express = require("express");
const router = express.Router();
const materialController = require('../../controllers/materialController');
const { protect } = require('../../middleware/authMiddleware');

// GET all materials, POST new material, HEAD, OPTIONS
router.route('/')
    .get(protect, materialController.getAllMaterials)
    .post(protect, materialController.createMaterial)
    .head(protect, materialController.headMaterials)       // Add HEAD
    .options(materialController.getMaterialOptions); // Add OPTIONS

// Search materials - MUST come BEFORE the /:id route
router.route('/search')
    .get(protect, materialController.searchMaterials);

// GET, PUT, DELETE, PATCH, HEAD, OPTIONS material by ID
router.route('/:id')
    .get(protect, materialController.getMaterialById)
    .put(protect, materialController.updateMaterial)
    .delete(protect, materialController.deleteMaterial)
    .patch(protect, materialController.patchMaterial)
    .head(protect, materialController.headMaterial)       // Add HEAD
    .options(protect, materialController.getMaterialIdOptions); // Add OPTIONS

module.exports = router;
