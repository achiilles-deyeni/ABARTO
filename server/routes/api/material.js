const express = require("express");
const router = express.Router();
const materialController = require('../../controllers/materialController');

// GET all materials, POST new material, HEAD, OPTIONS
router.route('/')
    .get(materialController.getAllMaterials)
    .post(materialController.createMaterial)
    .head(materialController.headMaterials)       // Add HEAD
    .options(materialController.getMaterialOptions); // Add OPTIONS

// Search materials - MUST come BEFORE the /:id route
router.route('/search')
    .get(materialController.searchMaterials);

// GET, PUT, DELETE, PATCH, HEAD, OPTIONS material by ID
router.route('/:id')
    .get(materialController.getMaterialById)
    .put(materialController.updateMaterial)
    .delete(materialController.deleteMaterial)
    .patch(materialController.patchMaterial)
    .head(materialController.headMaterial)       // Add HEAD
    .options(materialController.getMaterialIdOptions); // Add OPTIONS

module.exports = router;
