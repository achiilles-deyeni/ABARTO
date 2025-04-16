const express = require("express");
const router = express.Router();
const chemicalController = require('../../controllers/chemicalController');
const { protect } = require('../../middleware/authMiddleware');

// Base route: /api/chemicals
router.route('/')
    .get(protect, chemicalController.getAllChemicalCompounds)
    .post(protect, chemicalController.createChemicalCompound)
    .head(protect, chemicalController.headChemicalCompounds)
    .options(chemicalController.getChemicalCompoundOptions);

// Search route: /api/chemicals/search
router.route('/search')
    .get(protect, chemicalController.searchChemicalCompounds);

// Single chemical route: /api/chemicals/:id
router.route('/:id')
    .get(protect, chemicalController.getChemicalCompoundById)
    .put(protect, chemicalController.updateChemicalCompound)
    .patch(protect, chemicalController.patchChemicalCompound)
    .delete(protect, chemicalController.deleteChemicalCompound)
    .head(protect, chemicalController.headChemicalCompound)
    .options(chemicalController.getChemicalCompoundIdOptions);

module.exports = router;
