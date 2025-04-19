const express = require("express");
const router = express.Router();
// Assuming controller is correctly located at '../../controllers/supplyController'
const supplyController = require('../../controllers/supplyController');
// Assuming authMiddleware is correctly located at '../../middleware/authMiddleware'
const { protect } = require('../../middleware/authMiddleware');

// BULK OPERATIONS ROUTE - Placed before /:id to avoid conflict
router.route('/bulk')
    .post(protect, supplyController.bulkCreateSuppliers); // This name already matched

// Search route: /api/supplies/search
router.route('/search')
    .get(supplyController.searchSupplies); // Corrected name

// Single supply route: /api/supplies/:id
router.route('/:id')
    .get(supplyController.getSupplyById) // Corrected name
    .put(supplyController.updateSupply) // Corrected name
    .patch(supplyController.patchSupply) // Corrected name
    .delete(supplyController.deleteSupply) // Corrected name
    .head(supplyController.headSupply) // Corrected name
    .options(supplyController.getSupplyIdOptions); // This name already matched

// Base route: /api/supplies - Defined last (or ensure no conflicts with /search, /bulk, /:id)
router.route('/')
    .get(supplyController.getAllSupplies) // Corrected name
    .post(supplyController.createSupply) // Corrected name
    .head(supplyController.headSupplies) // Corrected name
    .options(supplyController.getSupplyOptions); // Corrected name


module.exports = router;