const express = require("express");
const router = express.Router();
const reportController = require('../../controllers/reportController'); // NOTE: Controller needs to be created
const { protect } = require('../../middleware/authMiddleware');

// Assuming this relates to generating or managing reports

// GET all reports (or configurations), POST new report (or trigger generation), HEAD, OPTIONS
router.route('/')
    .get(protect, reportController.getAllReports)    // Placeholder
    .post(protect, reportController.createReport)   // Placeholder (could trigger generation)
    .head(protect, reportController.headReports)    // Placeholder
    .options(reportController.getReportOptions); // Placeholder

// Search reports - MUST come BEFORE the /:id route
router.route('/search')
    .get(protect, reportController.searchReports);   // Placeholder

// --- AGGREGATION ROUTES ---
// GET Product Price Stats
router.route('/stats/product-price')
    .get(protect, reportController.getProductPriceStats);

// GET, PUT (update config?), DELETE, PATCH (update config?), HEAD, OPTIONS report by ID
router.route('/:id')
    .get(protect, reportController.getReportById)   // Placeholder (get specific report or config)
    .put(protect, reportController.updateReport)   // Placeholder (update config?)
    .delete(protect, reportController.deleteReport) // Placeholder (delete report or config)
    .patch(protect, reportController.patchReport)   // Placeholder (update config?)
    .head(protect, reportController.headReport)     // Placeholder
    .options(reportController.getReportIdOptions); // Placeholder

module.exports = router;
