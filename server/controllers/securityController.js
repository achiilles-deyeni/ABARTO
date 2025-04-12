const SecurityLog = require('../models/securityLog'); // Assuming ../models/securityLog.js exists

// Get all security items (logs)
exports.getAllSecurityItems = async (req, res) => {
  try {
    // Pagination, Sorting, Limiting
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25; // Logs might need larger default limit
    const sort = req.query.sort || 'timestamp'; // Default sort
    const order = req.query.order || 'desc'; // Default to newest first
    const skip = (page - 1) * limit;
    const maxLimit = 200; // Allow higher limit for logs
    const effectiveLimit = Math.min(limit, maxLimit);
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const totalLogs = await SecurityLog.countDocuments();
    const logs = await SecurityLog.find()
      .sort(sortOptions)
      .skip(skip)
      .limit(effectiveLimit);

    res.status(200).json({
        success: true,
        total: totalLogs,
        page: page,
        limit: effectiveLimit,
        totalPages: Math.ceil(totalLogs / effectiveLimit),
        count: logs.length,
        data: logs
    });
  } catch (error) {
    console.error('Error fetching security logs:', error);
    res.status(500).json({ success: false, error: 'Server error fetching security logs: ' + error.message });
  }
};

// Get security item (log) by ID
exports.getSecurityItemById = async (req, res) => {
  try {
    const log = await SecurityLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, error: 'Security log not found' });
    }
    res.status(200).json({ success: true, data: log });
  } catch (error) {
    console.error('Error fetching security log by ID:', error);
    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error fetching security log' });
  }
};

// Create new security item (log)
exports.createSecurityItem = async (req, res) => {
  try {
    const { eventType, level, userId, details } = req.body;
    if (!eventType || !details) {
      return res.status(400).json({ success: false, message: 'Missing required fields: eventType, details' });
    }

    const newLog = new SecurityLog({
      timestamp: req.body.timestamp || Date.now(),
      eventType,
      level: level || 'info', // Default level
      userId, // Can be null if not user-specific
      details
    });
    const savedLog = await newLog.save();
    res.status(201).json({ success: true, data: savedLog });
  } catch (error) {
    console.error('Error creating security log:', error);
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else {
        res.status(500).json({ success: false, error: 'Server error creating security log' });
    }
  }
};

// Update security item (log) (PUT - replace) - Generally, logs are immutable, but added for pattern consistency
exports.updateSecurityItem = async (req, res) => {
  try {
    const { timestamp, eventType, level, userId, details } = req.body;
     if (!timestamp || !eventType || !details || !level) {
        return res.status(400).json({ success: false, message: 'Missing required fields for update' });
     }
    // Note: Updating logs might not be standard practice. Consider if PATCH is more appropriate or if logs should be immutable.
    const log = await SecurityLog.findByIdAndUpdate(
      req.params.id,
      { timestamp, eventType, level, userId, details },
      { new: true, runValidators: true, overwrite: true }
    );
    if (!log) {
      return res.status(404).json({ success: false, error: 'Security log not found' });
    }
    res.status(200).json({ success: true, data: log });
  } catch (error) {
    console.error('Error updating security log (PUT):', error);
     if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
     } else if (error.name === 'CastError') {
        res.status(400).json({ success: false, error: 'Invalid ID format' });
     } else {
        res.status(500).json({ success: false, error: 'Server error updating security log' });
     }
  }
};

// Patch security item (log) (PATCH - partial update) - See note on PUT
exports.patchSecurityItem = async (req, res) => {
  try {
    if (req.body._id) delete req.body._id;
    // Note: Patching logs might not be standard practice.
    const log = await SecurityLog.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true, context: 'query' }
    );
    if (!log) {
      return res.status(404).json({ success: false, error: 'Security log not found' });
    }
    res.status(200).json({ success: true, data: log });
  } catch (error) {
    console.error('Error patching security log:', error);
     if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
     } else if (error.name === 'CastError') {
        res.status(400).json({ success: false, error: 'Invalid ID format' });
     } else {
        res.status(500).json({ success: false, error: 'Server error patching security log' });
     }
  }
};

// Delete security item (log) - See note on PUT/PATCH
exports.deleteSecurityItem = async (req, res) => {
  try {
    // Note: Deleting logs might not be standard practice. Consider archiving instead.
    const log = await SecurityLog.findByIdAndDelete(req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, error: 'Security log not found' });
    }
    res.status(200).json({ success: true, message: 'Security log deleted successfully', data: {} });
  } catch (error) {
    console.error('Error deleting security log:', error);
    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error deleting security log' });
  }
};

// Search security items (logs)
exports.searchSecurityItems = async (req, res) => {
  try {
    const { eventType, level, userId, startDate, endDate, page = 1, limit = 25, sort = 'timestamp', order = 'desc' } = req.query;
    let query = {};
    if (eventType) query.eventType = { $regex: eventType, $options: 'i' };
    if (level) query.level = level;
    if (userId) query.userId = userId;
     if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    // Pagination, Sorting, Limiting
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const maxLimit = 200;
    const effectiveLimit = Math.min(limitNum, maxLimit);
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const totalMatchingLogs = await SecurityLog.countDocuments(query);
    const logs = await SecurityLog.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(effectiveLimit);

    res.status(200).json({
        success: true,
        total: totalMatchingLogs,
        page: pageNum,
        limit: effectiveLimit,
        totalPages: Math.ceil(totalMatchingLogs / effectiveLimit),
        count: logs.length,
        data: logs
    });
  } catch (error) {
    console.error('Error searching security logs:', error);
    res.status(500).json({ success: false, error: 'Server error searching security logs: ' + error.message });
  }
};

// HEAD request for all security items (logs)
exports.headSecurityItems = async (req, res) => {
  try {
    // Consider filtering for HEAD count if needed
    const count = await SecurityLog.countDocuments();
    res.set('X-Total-Count', count.toString());
    res.set('X-Resource-Type', 'SecurityLogs');
    res.status(200).end();
  } catch (error) {
    console.error('Error handling HEAD for security logs:', error);
    res.status(500).end();
  }
};

// OPTIONS request for security items (logs) collection
exports.getSecurityOptions = (req, res) => {
  // Note: May want to restrict methods if logs are immutable (remove POST, PUT, PATCH, DELETE from Allow)
  res.set('Allow', 'GET, POST, HEAD, OPTIONS'); // Adjust based on immutability decision
  res.status(200).end();
};

// HEAD request for single security item (log)
exports.headSecurityItem = async (req, res) => {
  try {
    const log = await SecurityLog.findById(req.params.id).select('timestamp'); // Only need timestamp for Last-Modified
    if (!log) {
      return res.status(404).end();
    }
    res.set('X-Resource-Type', 'SecurityLog');
    if (log.timestamp) {
        res.set('Last-Modified', log.timestamp.toUTCString()); // Use timestamp
    }
    res.status(200).end();
  } catch (error) {
    console.error('Error handling HEAD for single security log:', error);
     if (error.name === 'CastError') {
        return res.status(400).end();
    }
    res.status(500).end();
  }
};

// OPTIONS request for single security item (log)
exports.getSecurityIdOptions = (req, res) => {
  // Note: Adjust allowed methods based on immutability decision
  res.set('Allow', 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS'); // Adjust as needed
  res.status(200).end();
};
