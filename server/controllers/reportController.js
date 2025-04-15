const Report = require('../models/report'); // NOTE: Create ../models/report.js
const Product = require('../models/products'); // Need Product model for aggregation

// Import Service and Utilities
const reportService = require('../services/reportService');
const { getPaginationParams } = require('../utils/pagination');
const asyncHandler = require('../utils/asyncHandler'); // Import asyncHandler

// Wrap controller functions with asyncHandler

// Get all reports (or report configurations)
exports.getAllReports = asyncHandler(async (req, res, next) => {
  // Use the pagination utility
  const paginationParams = getPaginationParams(req.query, 'generatedAt', 'desc');

  // Call the service method
  const { reports, totalReports } = await reportService.getAllReports(paginationParams);

  res.status(200).json({
    success: true,
    total: totalReports,
    page: paginationParams.page,
    limit: paginationParams.limit,
    totalPages: Math.ceil(totalReports / paginationParams.limit),
    count: reports.length,
    data: reports
  });
  // Removed try...catch - asyncHandler handles errors
});

// Get report by ID
exports.getReportById = asyncHandler(async (req, res, next) => {
  // Call the service method
  const report = await reportService.getReportById(req.params.id);
  if (!report) {
    // Send 404 directly if not found, error handler won't catch this
    return res.status(404).json({ success: false, error: 'Report not found' });
  }
  res.status(200).json({ success: true, data: report });
  // Removed try...catch - asyncHandler handles errors like CastError
});

// Create new report (or trigger generation)
exports.createReport = asyncHandler(async (req, res, next) => {
  const { reportName, type, parameters } = req.body;
  // Basic input validation (can be moved to middleware)
  if (!reportName || !type) {
    // Send 400 directly for simple validation
    return res.status(400).json({ success: false, message: 'Missing required fields: reportName, type' });
  }

  // Call the service method
  const savedReport = await reportService.createReport({ reportName, type, parameters });
  res.status(201).json({ success: true, data: savedReport });
  // Removed try...catch - asyncHandler handles errors like ValidationError
});

// Update report (PUT - replace)
exports.updateReport = asyncHandler(async (req, res, next) => {
  const { reportName, type, parameters, generatedAt } = req.body;
  // Basic input validation
   if (!reportName || !type || !generatedAt) {
     return res.status(400).json({ success: false, message: 'Missing required fields for update' });
   }

  // Call the service method
  const report = await reportService.updateReport(req.params.id, { reportName, type, parameters, generatedAt });

  if (!report) {
    return res.status(404).json({ success: false, error: 'Report not found' });
  }
  res.status(200).json({ success: true, data: report });
  // Removed try...catch - asyncHandler handles errors like ValidationError, CastError
});

// Patch report (PATCH - partial update)
exports.patchReport = asyncHandler(async (req, res, next) => {
  // Call the service method (body is passed directly)
  const report = await reportService.patchReport(req.params.id, req.body);

  if (!report) {
    return res.status(404).json({ success: false, error: 'Report not found' });
  }
  res.status(200).json({ success: true, data: report });
  // Removed try...catch - asyncHandler handles errors like ValidationError, CastError
});

// Delete report
exports.deleteReport = asyncHandler(async (req, res, next) => {
  // Call the service method
  const report = await reportService.deleteReport(req.params.id);
  if (!report) {
    return res.status(404).json({ success: false, error: 'Report not found' });
  }
  res.status(200).json({ success: true, message: 'Report deleted successfully', data: {} });
  // Removed try...catch - asyncHandler handles errors like CastError
});

// Search reports
exports.searchReports = asyncHandler(async (req, res, next) => {
  // Separate search criteria from pagination/sort params
  const { reportName, type, startDate, endDate, ...paginationQuery } = req.query;
  const paginationParams = getPaginationParams(paginationQuery, 'generatedAt', 'desc');

  // Build the search query criteria
  let queryCriteria = {};
  if (reportName) queryCriteria.reportName = { $regex: reportName, $options: 'i' };
  if (type) queryCriteria.type = { $regex: type, $options: 'i' };
  if (startDate || endDate) {
      queryCriteria.generatedAt = {};
      if (startDate) queryCriteria.generatedAt.$gte = new Date(startDate);
      if (endDate) queryCriteria.generatedAt.$lte = new Date(endDate);
  }
  // Add searching within parameters if needed: queryCriteria['parameters.someKey'] = value

  // Call the service method
  const { reports, totalMatchingReports } = await reportService.searchReports(queryCriteria, paginationParams);

  res.status(200).json({
      success: true,
      total: totalMatchingReports,
      page: paginationParams.page,
      limit: paginationParams.limit,
      totalPages: Math.ceil(totalMatchingReports / paginationParams.limit),
      count: reports.length,
      data: reports
  });
  // Removed try...catch - asyncHandler handles errors
});

// HEAD request for all reports
exports.headReports = asyncHandler(async (req, res, next) => {
  // Optional: Add filtering based on query params if needed
  // const queryCriteria = buildQueryCriteria(req.query); // Example helper
  const count = await reportService.getReportsCount(/* queryCriteria */);
  res.set('X-Total-Count', count.toString());
  res.set('X-Resource-Type', 'Reports');
  res.status(200).end();
  // Removed try...catch - asyncHandler handles errors
});

// OPTIONS request for reports collection
// No async operation, no asyncHandler needed
exports.getReportOptions = (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS');
  res.status(200).end();
};

// HEAD request for single report
exports.headReport = asyncHandler(async (req, res, next) => {
  const reportMeta = await reportService.getReportMetadata(req.params.id);
  if (!reportMeta) {
    return res.status(404).end(); // Return 404 directly
  }
  res.set('X-Resource-Type', 'Report');
  const lastModified = reportMeta.updatedAt || reportMeta.generatedAt || reportMeta.createdAt;
  if (lastModified) {
      res.set('Last-Modified', lastModified.toUTCString());
  }
  res.status(200).end();
  // Removed try...catch - asyncHandler handles errors like CastError
});

// OPTIONS request for single report
// No async operation, no asyncHandler needed
exports.getReportIdOptions = (req, res) => {
  res.set('Allow', 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS');
  res.status(200).end();
};

// AGGREGATION EXAMPLE: Get Product Price Stats
exports.getProductPriceStats = asyncHandler(async (req, res, next) => {
  // Call the service method
  const stats = await reportService.getProductPriceStats();

  // Handle case where service returns default values for no products
  if (stats.totalProducts === 0 && stats.averagePrice === 0 && stats.minPrice === 0 && stats.maxPrice === 0) {
       return res.status(200).json({ 
          success: true, 
          message: "No products found to calculate stats.", 
          data: stats
      });
  }

  res.status(200).json({
    success: true,
    data: stats
  });
  // Removed try...catch - asyncHandler handles errors
});
