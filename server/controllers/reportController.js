const Report = require('../models/report'); // NOTE: Create ../models/report.js

// Get all reports (or report configurations)
exports.getAllReports = async (req, res) => {
  try {
    // Add filtering/pagination as needed
    const reports = await Report.find().sort({ generatedAt: -1 }); // Example sort
    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, error: 'Server error fetching reports' });
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
    const { reportName, type, startDate, endDate } = req.query;
    let query = {};
    if (reportName) query.reportName = { $regex: reportName, $options: 'i' };
    if (type) query.type = { $regex: type, $options: 'i' };
     if (startDate || endDate) {
        query.generatedAt = {};
        if (startDate) query.generatedAt.$gte = new Date(startDate);
        if (endDate) query.generatedAt.$lte = new Date(endDate);
    }
    // Add searching within parameters if needed: query['parameters.someKey'] = value

    const reports = await Report.find(query).sort({ generatedAt: -1 });
    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    console.error('Error searching reports:', error);
    res.status(500).json({ success: false, error: 'Server error searching reports' });
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
