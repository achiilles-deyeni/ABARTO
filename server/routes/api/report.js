const express = require("express");
const router = express.Router();
const reportController = require('../../controllers/reportController'); // NOTE: Controller needs to be created

// Assuming this relates to generating or managing reports

// GET all reports (or configurations), POST new report (or trigger generation), HEAD, OPTIONS
router.route('/')
    .get(reportController.getAllReports)    // Placeholder
    .post(reportController.createReport)   // Placeholder (could trigger generation)
    .head(reportController.headReports)    // Placeholder
    .options(reportController.getReportOptions); // Placeholder

// Search reports - MUST come BEFORE the /:id route
router.route('/search')
    .get(reportController.searchReports);   // Placeholder

// GET, PUT (update config?), DELETE, PATCH (update config?), HEAD, OPTIONS report by ID
router.route('/:id')
    .get(reportController.getReportById)   // Placeholder (get specific report or config)
    .put(reportController.updateReport)   // Placeholder (update config?)
    .delete(reportController.deleteReport) // Placeholder (delete report or config)
    .patch(reportController.patchReport)   // Placeholder (update config?)
    .head(reportController.headReport)     // Placeholder
    .options(reportController.getReportIdOptions); // Placeholder

module.exports = router;
