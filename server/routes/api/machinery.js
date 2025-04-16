const express = require("express");
const router = express.Router();
const machineryController = require('../../controllers/machineryController');
const { protect } = require('../../middleware/authMiddleware');

// Base route: /api/machinery
router.route('/')
    .get(machineryController.getAllMachineryParts)
    .post(machineryController.createMachineryPart)
    .head(machineryController.headMachineryParts)
    .options(machineryController.getMachineryPartOptions);

// Search route: /api/machinery/search
router.route('/search')
    .get(machineryController.searchMachineryParts);

// Single part route: /api/machinery/:id
router.route('/:id')
    .get(machineryController.getMachineryPartById)
    .put(machineryController.updateMachineryPart)
    .patch(machineryController.patchMachineryPart)
    .delete(machineryController.deleteMachineryPart)
    .head(machineryController.headMachineryPart)
    .options(machineryController.getMachineryPartIdOptions);

module.exports = router;
