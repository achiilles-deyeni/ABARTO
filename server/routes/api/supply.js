const express = require("express");
const router = express.Router();
const supplyController = require('../../controllers/supplyController'); // NOTE: Controller needs to be created
const { protect } = require('../../middleware/authMiddleware');

// GET all supplies, POST new supply, HEAD, OPTIONS
router.route('/')
    .get(protect, supplyController.getAllSupplies)       // Placeholder: Implement in controller
    .post(protect, supplyController.createSupply)       // Placeholder: Implement in controller
    .head(protect, supplyController.headSupplies)       // Placeholder: Implement in controller
    .options(supplyController.getSupplyOptions);   // Placeholder: Implement in controller

// Search supplies - MUST come BEFORE the /:id route
router.route('/search')
    .get(protect, supplyController.searchSupplies);      // Placeholder: Implement in controller

// BULK OPERATIONS ROUTE - Place before /:id
router.route('/bulk')
    .post(protect, supplyController.bulkCreateSuppliers);

// GET, PUT, DELETE, PATCH, HEAD, OPTIONS supply by ID
router.route('/:id')
    .get(protect, supplyController.getSupplyById)       // Placeholder: Implement in controller
    .put(protect, supplyController.updateSupply)       // Placeholder: Implement in controller
    .delete(protect, supplyController.deleteSupply)     // Placeholder: Implement in controller
    .patch(protect, supplyController.patchSupply)       // Placeholder: Implement in controller
    .head(protect, supplyController.headSupply)         // Placeholder: Implement in controller
    .options(supplyController.getSupplyIdOptions); // Placeholder: Implement in controller

module.exports = router;
