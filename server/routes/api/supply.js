const express = require("express");
const router = express.Router();
const supplyController = require('../../controllers/supplyController'); // NOTE: Controller needs to be created

// GET all supplies, POST new supply, HEAD, OPTIONS
router.route('/')
    .get(supplyController.getAllSupplies)       // Placeholder: Implement in controller
    .post(supplyController.createSupply)       // Placeholder: Implement in controller
    .head(supplyController.headSupplies)       // Placeholder: Implement in controller
    .options(supplyController.getSupplyOptions);   // Placeholder: Implement in controller

// Search supplies - MUST come BEFORE the /:id route
router.route('/search')
    .get(supplyController.searchSupplies);      // Placeholder: Implement in controller

// GET, PUT, DELETE, PATCH, HEAD, OPTIONS supply by ID
router.route('/:id')
    .get(supplyController.getSupplyById)       // Placeholder: Implement in controller
    .put(supplyController.updateSupply)       // Placeholder: Implement in controller
    .delete(supplyController.deleteSupply)     // Placeholder: Implement in controller
    .patch(supplyController.patchSupply)       // Placeholder: Implement in controller
    .head(supplyController.headSupply)         // Placeholder: Implement in controller
    .options(supplyController.getSupplyIdOptions); // Placeholder: Implement in controller

module.exports = router;
