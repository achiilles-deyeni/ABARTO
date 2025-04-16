const express = require("express");
const router = express.Router();
const supplyController = require('../../controllers/supplyController'); // NOTE: Controller needs to be created
const { protect } = require('../../middleware/authMiddleware');

// Base route: /api/supplies
router.route('/')
    .get(supplyController.getAllIndustrialSupplies)
    .post(supplyController.createIndustrialSupply)
    .head(supplyController.headIndustrialSupplies)
    .options(supplyController.getIndustrialSupplyOptions);

// Search route: /api/supplies/search
router.route('/search')
    .get(supplyController.searchIndustrialSupplies);

// Single supply route: /api/supplies/:id
router.route('/:id')
    .get(supplyController.getIndustrialSupplyById)
    .put(supplyController.updateIndustrialSupply)
    .patch(supplyController.patchIndustrialSupply)
    .delete(supplyController.deleteIndustrialSupply)
    .head(supplyController.headIndustrialSupply)
    .options(supplyController.getIndustrialSupplyIdOptions);

// BULK OPERATIONS ROUTE - Place before /:id
router.route('/bulk')
    .post(protect, supplyController.bulkCreateSuppliers);

module.exports = router;
