const express = require("express");
const router = express.Router();
const chemicalController = require('../../controllers/chemicalController'); // NOTE: Controller needs to be created
const { protect } = require('../../middleware/authMiddleware');

// GET all chemicals, POST new chemical, HEAD, OPTIONS
router.route('/')
    .get(protect, chemicalController.getAllChemicals)    // Placeholder
    .post(protect, chemicalController.createChemical)   // Placeholder
    .head(protect, chemicalController.headChemicals)    // Placeholder
    .options(chemicalController.getChemicalOptions); // Placeholder

// Search chemicals - MUST come BEFORE the /:id route
router.route('/search')
    .get(protect, chemicalController.searchChemicals);   // Placeholder

// GET, PUT, DELETE, PATCH, HEAD, OPTIONS chemical by ID
router.route('/:id')
    .get(protect, chemicalController.getChemicalById)   // Placeholder
    .put(protect, chemicalController.updateChemical)   // Placeholder
    .delete(protect, chemicalController.deleteChemical) // Placeholder
    .patch(protect, chemicalController.patchChemical)   // Placeholder
    .head(protect, chemicalController.headChemical)     // Placeholder
    .options(chemicalController.getChemicalIdOptions); // Placeholder

module.exports = router;
