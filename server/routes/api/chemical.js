const express = require("express");
const router = express.Router();
const chemicalController = require('../../controllers/chemicalController');
const { protect } = require('../../middleware/authMiddleware');

// Base route: /api/chemicals
router.route('/')
    .get(protect, chemicalController.getAllChemicals)
    .post(protect, chemicalController.createChemical)
    .head(protect, chemicalController.headChemicals)
    .options(chemicalController.getChemicalOptions);

// Search route: /api/chemicals/search
router.route('/search')
    .get(protect, chemicalController.searchChemicals);

// Single chemical route: /api/chemicals/:id
router.route('/:id')
    .get(protect, chemicalController.getChemicalById)
    .put(protect, chemicalController.updateChemical)
    .patch(protect, chemicalController.patchChemical)
    .delete(protect, chemicalController.deleteChemical)
    .head(protect, chemicalController.headChemical)
    .options(chemicalController.getChemicalIdOptions);

module.exports = router;
