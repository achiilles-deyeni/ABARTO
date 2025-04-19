const express = require("express");
const router = express.Router();
const searchController = require('../../controllers/searchController');
const { protect } = require('../../middleware/authMiddleware');

// @route   GET /api/search
// @desc    Global search across multiple collections
// @access  Private
router.route('/')
    .get(protect, searchController.globalSearch);

// Add OPTIONS if needed
// router.route('/').options((req, res) => {
//     res.set('Allow', 'GET, OPTIONS');
//     res.status(200).end();
// });

module.exports = router;
