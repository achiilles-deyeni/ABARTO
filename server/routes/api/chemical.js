const express = require("express");
const router = express.Router();
const chemicalController = require('../../controllers/chemicalController'); // NOTE: Controller needs to be created

// GET all chemicals, POST new chemical, HEAD, OPTIONS
router.route('/')
    .get(chemicalController.getAllChemicals)    // Placeholder
    .post(chemicalController.createChemical)   // Placeholder
    .head(chemicalController.headChemicals)    // Placeholder
    .options(chemicalController.getChemicalOptions); // Placeholder

// Search chemicals - MUST come BEFORE the /:id route
router.route('/search')
    .get(chemicalController.searchChemicals);   // Placeholder

// GET, PUT, DELETE, PATCH, HEAD, OPTIONS chemical by ID
router.route('/:id')
    .get(chemicalController.getChemicalById)   // Placeholder
    .put(chemicalController.updateChemical)   // Placeholder
    .delete(chemicalController.deleteChemical) // Placeholder
    .patch(chemicalController.patchChemical)   // Placeholder
    .head(chemicalController.headChemical)     // Placeholder
    .options(chemicalController.getChemicalIdOptions); // Placeholder

module.exports = router;
