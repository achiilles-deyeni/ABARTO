const Report = require('../models/report'); // NOTE: Create ../models/report.js
const Product = require('../models/products'); // Need Product model for aggregation

// Get all reports (or report configurations)
exports.getAllReports = async (req, res) => {
  try {
    // Pagination, Sorting, Limiting
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort || 'generatedAt'; // Default sort
    const order = req.query.order || 'desc'; // Default to newest first
    const skip = (page - 1) * limit;
    const maxLimit = 100;
    const effectiveLimit = Math.min(limit, maxLimit);
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const totalReports = await Report.countDocuments();
    const reports = await Report.find()
      .sort(sortOptions)
      .skip(skip)
      .limit(effectiveLimit);

    res.status(200).json({
      success: true,
      total: totalReports,
      page: page,
      limit: effectiveLimit,
      totalPages: Math.ceil(totalReports / effectiveLimit),
      count: reports.length,
      data: reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, error: 'Server error fetching reports: ' + error.message });
  }
};

// Get report by ID
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    // Potentially handle report data retrieval/streaming here if stored separately
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Error fetching report by ID:', error);
    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error fetching report' });
  }
};

// Create new report (or trigger generation)
exports.createReport = async (req, res) => {
  try {
    // This could represent saving a report configuration or triggering generation
    const { reportName, type, parameters } = req.body;
    if (!reportName || !type) {
      return res.status(400).json({ success: false, message: 'Missing required fields: reportName, type' });
    }

    // Placeholder: Add actual report generation logic here if needed
    // This example just saves a record representing the report/config.
    const newReport = new Report({
      reportName,
      type,
      parameters: parameters || {},
      generatedAt: Date.now(),
      // filePath: 'path/to/generated/report.pdf' // Example if storing file path
    });
    const savedReport = await newReport.save();
    res.status(201).json({ success: true, data: savedReport });
  } catch (error) {
    console.error('Error creating report:', error);
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else {
        res.status(500).json({ success: false, error: 'Server error creating report' });
    }
  }
};

// Update report (PUT - replace) - Likely for updating configuration
exports.updateReport = async (req, res) => {
  try {
    const { reportName, type, parameters, generatedAt } = req.body;
    // Add PUT validation
     if (!reportName || !type || !generatedAt) { // Check required fields for PUT
       return res.status(400).json({ success: false, message: 'Missing required fields for update' });
     }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { reportName, type, parameters, generatedAt /* , filePath */ },
      { new: true, runValidators: true, overwrite: true }
    );
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Error updating report (PUT):', error);
     if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
     } else if (error.name === 'CastError') {
        res.status(400).json({ success: false, error: 'Invalid ID format' });
     } else {
        res.status(500).json({ success: false, error: 'Server error updating report' });
     }
  }
};

// Patch report (PATCH - partial update) - Likely for updating configuration
exports.patchReport = async (req, res) => {
  try {
    if (req.body._id) delete req.body._id;

    const report = await Report.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true, context: 'query' }
    );
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Error patching report:', error);
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else if (error.name === 'CastError') {
        res.status(400).json({ success: false, error: 'Invalid ID format' });
    } else {
        res.status(500).json({ success: false, error: 'Server error patching report' });
    }
  }
};

// Delete report
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    // Potentially delete associated report file from storage here
    res.status(200).json({ success: true, message: 'Report deleted successfully', data: {} });
  } catch (error) {
    console.error('Error deleting report:', error);
    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error deleting report' });
  }
};

// Search reports
exports.searchReports = async (req, res) => {
  try {
    const { reportName, type, startDate, endDate, page = 1, limit = 10, sort = 'generatedAt', order = 'desc' } = req.query;
    let query = {};
    if (reportName) query.reportName = { $regex: reportName, $options: 'i' };
    if (type) query.type = { $regex: type, $options: 'i' };
     if (startDate || endDate) {
        query.generatedAt = {};
        if (startDate) query.generatedAt.$gte = new Date(startDate);
        if (endDate) query.generatedAt.$lte = new Date(endDate);
    }
    // Add searching within parameters if needed: query['parameters.someKey'] = value

    // Pagination, Sorting, Limiting
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const maxLimit = 100;
    const effectiveLimit = Math.min(limitNum, maxLimit);
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const totalMatchingReports = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(effectiveLimit);

    res.status(200).json({
        success: true,
        total: totalMatchingReports,
        page: pageNum,
        limit: effectiveLimit,
        totalPages: Math.ceil(totalMatchingReports / effectiveLimit),
        count: reports.length,
        data: reports
    });
  } catch (error) {
    console.error('Error searching reports:', error);
    res.status(500).json({ success: false, error: 'Server error searching reports: ' + error.message });
  }
};

// HEAD request for all reports
exports.headReports = async (req, res) => {
  try {
    const count = await Report.countDocuments(); // Add filtering if applied to GET
    res.set('X-Total-Count', count.toString());
    res.set('X-Resource-Type', 'Reports');
    res.status(200).end();
  } catch (error) {
    console.error('Error handling HEAD for reports:', error);
    res.status(500).end();
  }
};

// OPTIONS request for reports collection
exports.getReportOptions = (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS');
  res.status(200).end();
};

// HEAD request for single report
exports.headReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).select('generatedAt updatedAt createdAt');
    if (!report) {
      return res.status(404).end();
    }
    res.set('X-Resource-Type', 'Report');
    const lastModified = report.updatedAt || report.generatedAt || report.createdAt;
    if (lastModified) {
        res.set('Last-Modified', lastModified.toUTCString());
    }
    res.status(200).end();
  } catch (error) {
    console.error('Error handling HEAD for single report:', error);
     if (error.name === 'CastError') {
        return res.status(400).end();
    }
    res.status(500).end();
  }
};

// OPTIONS request for single report
exports.getReportIdOptions = (req, res) => {
  res.set('Allow', 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS');
  res.status(200).end();
};

// AGGREGATION EXAMPLE: Get Product Price Stats
exports.getProductPriceStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null, // Group all products together
          totalProducts: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          // Optionally group by category:
          // _id: '$category',
          // totalProducts: { $sum: 1 },
          // averagePrice: { $avg: '$price' },
          // etc...
        }
      }
    ]);

    if (!stats || stats.length === 0) {
        // Handle case where there are no products
        return res.status(200).json({ 
            success: true, 
            message: "No products found to calculate stats.", 
            data: { 
                totalProducts: 0, 
                averagePrice: 0, 
                minPrice: 0, 
                maxPrice: 0 
            } 
        });
    }

    res.status(200).json({
      success: true,
      data: stats[0] // The result is an array with one document
    });
  } catch (error) {
    console.error('Error calculating product price stats:', error);
    res.status(500).json({ success: false, error: 'Server error calculating product stats: ' + error.message });
  }
};
