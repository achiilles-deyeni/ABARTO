const WholesaleOrder = require('../models/wholesaleOrder'); // Corrected path and assumed model name

// Get all wholesale records
exports.getAllWholesaleRecords = async (req, res) => {
  try {
    // Pagination, Sorting, Limiting
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort || 'orderDate'; // Default sort
    const order = req.query.order || 'desc'; // Default newest first
    const skip = (page - 1) * limit;
    const maxLimit = 100;
    const effectiveLimit = Math.min(limit, maxLimit);
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const totalRecords = await WholesaleOrder.countDocuments();
    const records = await WholesaleOrder.find()
        .sort(sortOptions)
        .skip(skip)
        .limit(effectiveLimit)
        // .populate('customerId') // Optional: Populate customer details if using refs
        // .populate('productId'); // Optional: Populate product details if using refs

    res.status(200).json({
        success: true,
        total: totalRecords,
        page: page,
        limit: effectiveLimit,
        totalPages: Math.ceil(totalRecords / effectiveLimit),
        count: records.length,
        data: records
    });
  } catch (error) {
    console.error('Error fetching wholesale records:', error);
    res.status(500).json({ success: false, error: 'Server error fetching wholesale records: ' + error.message });
  }
};

// Get wholesale record by ID
exports.getWholesaleRecordById = async (req, res) => {
  try {
    const record = await WholesaleOrder.findById(req.params.id);
        // .populate('customerId')
        // .populate('productId');
    if (!record) {
      return res.status(404).json({ success: false, error: 'Wholesale record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching wholesale record by ID:', error);
    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error fetching wholesale record' });
  }
};

// Create new wholesale record
exports.createWholesaleRecord = async (req, res) => {
  try {
    const { customerId, productId, quantity, totalPrice } = req.body;
    if (!customerId || !productId || quantity == null || totalPrice == null) {
      return res.status(400).json({ success: false, message: 'Missing required fields: customerId, productId, quantity, totalPrice' });
    }

    const newRecord = new WholesaleOrder({
      customerId,
      productId,
      quantity,
      totalPrice,
      orderDate: req.body.orderDate || Date.now()
    });
    const savedRecord = await newRecord.save();
    res.status(201).json({ success: true, data: savedRecord });
  } catch (error) {
    console.error('Error creating wholesale record:', error);
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else {
        res.status(500).json({ success: false, error: 'Server error creating wholesale record' });
    }
  }
};

// Update wholesale record (PUT - replace)
exports.updateWholesaleRecord = async (req, res) => {
  try {
    const { customerId, productId, quantity, totalPrice, orderDate } = req.body;
     if (!customerId || !productId || quantity == null || totalPrice == null || !orderDate) {
      return res.status(400).json({ success: false, message: 'Missing required fields for update' });
    }

    const record = await WholesaleOrder.findByIdAndUpdate(
      req.params.id,
      { customerId, productId, quantity, totalPrice, orderDate },
      { new: true, runValidators: true, overwrite: true }
    );
    if (!record) {
      return res.status(404).json({ success: false, error: 'Wholesale record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    console.error('Error updating wholesale record (PUT):', error);
     if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
     } else if (error.name === 'CastError') {
        res.status(400).json({ success: false, error: 'Invalid ID format' });
     } else {
        res.status(500).json({ success: false, error: 'Server error updating wholesale record' });
     }
  }
};

// Patch wholesale record (PATCH - partial update)
exports.patchWholesaleRecord = async (req, res) => {
  try {
    if (req.body._id) delete req.body._id;
    const record = await WholesaleOrder.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true, context: 'query' }
    );
    if (!record) {
      return res.status(404).json({ success: false, error: 'Wholesale record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    console.error('Error patching wholesale record:', error);
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else if (error.name === 'CastError') {
        res.status(400).json({ success: false, error: 'Invalid ID format' });
    } else {
        res.status(500).json({ success: false, error: 'Server error patching wholesale record' });
    }
  }
};

// Delete wholesale record
exports.deleteWholesaleRecord = async (req, res) => {
  try {
    const record = await WholesaleOrder.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, error: 'Wholesale record not found' });
    }
    res.status(200).json({ success: true, message: 'Wholesale record deleted successfully', data: {} });
  } catch (error) {
    console.error('Error deleting wholesale record:', error);
     if (error.name === 'CastError') {
        return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error deleting wholesale record' });
  }
};

// Search wholesale records
exports.searchWholesaleRecords = async (req, res) => {
  try {
    const { customerId, productId, minQuantity, startDate, endDate, page = 1, limit = 10, sort = 'orderDate', order = 'desc' } = req.query;
    let query = {};
    if (customerId) query.customerId = customerId; // Assuming direct ID match or use regex if searching name
    if (productId) query.productId = productId;
    if (minQuantity) query.quantity = { $gte: parseInt(minQuantity) };
    if (startDate || endDate) {
        query.orderDate = {};
        if (startDate) query.orderDate.$gte = new Date(startDate);
        if (endDate) query.orderDate.$lte = new Date(endDate);
    }

    // Pagination, Sorting, Limiting
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const maxLimit = 100;
    const effectiveLimit = Math.min(limitNum, maxLimit);
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const totalMatchingRecords = await WholesaleOrder.countDocuments(query);
    const records = await WholesaleOrder.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(effectiveLimit)
      // .populate('customerId') // Add populate here if needed for search results
      // .populate('productId');

    res.status(200).json({
        success: true,
        total: totalMatchingRecords,
        page: pageNum,
        limit: effectiveLimit,
        totalPages: Math.ceil(totalMatchingRecords / effectiveLimit),
        count: records.length,
        data: records
    });
  } catch (error) {
    console.error('Error searching wholesale records:', error);
    res.status(500).json({ success: false, error: 'Server error searching wholesale records: ' + error.message });
  }
};

// HEAD request for all wholesale records
exports.headWholesaleRecords = async (req, res) => {
  try {
    const count = await WholesaleOrder.countDocuments();
    res.set('X-Total-Count', count.toString());
    res.set('X-Resource-Type', 'WholesaleRecords');
    res.status(200).end();
  } catch (error) {
    console.error('Error handling HEAD for wholesale records:', error);
    res.status(500).end();
  }
};

// OPTIONS request for wholesale records collection
exports.getWholesaleOptions = (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS');
  res.status(200).end();
};

// HEAD request for single wholesale record
exports.headWholesaleRecord = async (req, res) => {
  try {
    const record = await WholesaleOrder.findById(req.params.id).select('updatedAt createdAt orderDate');
    if (!record) {
      return res.status(404).end();
    }
    res.set('X-Resource-Type', 'WholesaleRecord');
    const lastModified = record.updatedAt || record.createdAt || record.orderDate; // Use orderDate if others absent
    if (lastModified) {
        res.set('Last-Modified', lastModified.toUTCString());
    }
    res.status(200).end();
  } catch (error) {
    console.error('Error handling HEAD for single wholesale record:', error);
    if (error.name === 'CastError') {
        return res.status(400).end();
    }
    res.status(500).end();
  }
};

// OPTIONS request for single wholesale record
exports.getWholesaleIdOptions = (req, res) => {
  res.set('Allow', 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS');
  res.status(200).end();
};
