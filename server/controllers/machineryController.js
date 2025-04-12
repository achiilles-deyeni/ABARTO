const MachineryPart = require('../models/machineryPart'); // Assuming model name based on routes

// Get all machinery parts
exports.getAllMachinery = async (req, res) => {
  try {
    // Pagination, Sorting, Limiting
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort || 'name'; // Default sort by name
    const order = req.query.order || 'asc';
    const skip = (page - 1) * limit;
    const maxLimit = 100;
    const effectiveLimit = Math.min(limit, maxLimit);
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const totalMachinery = await MachineryPart.countDocuments();
    const machines = await MachineryPart.find()
      .sort(sortOptions)
      .skip(skip)
      .limit(effectiveLimit);

    res.status(200).json({
      success: true,
      total: totalMachinery,
      page: page,
      limit: effectiveLimit,
      totalPages: Math.ceil(totalMachinery / effectiveLimit),
      count: machines.length,
      data: machines
    });
  } catch (error) {
    console.error('Error fetching machinery:', error);
    res.status(500).json({ success: false, error: 'Server error fetching machinery: ' + error.message });
  }
};

// Get a single machinery part by ID
exports.getMachineryById = async (req, res) => {
  try {
    const machine = await MachineryPart.findById(req.params.id);
    if (!machine) {
      return res.status(404).json({ success: false, error: 'Machinery not found' });
    }
    res.status(200).json({ success: true, data: machine });
  } catch (error) {
    console.error('Error fetching machinery by ID:', error);
    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error fetching machinery' });
  }
};

// Create a new machinery part
exports.createMachinery = async (req, res) => {
  try {
    const { name, type, quantity, price, description } = req.body;

    // Basic validation example
    if (!name || !type || quantity == null || price == null) {
        return res.status(400).json({ success: false, message: 'Missing required fields: name, type, quantity, price' });
    }

    // Check if machine already exists (e.g., by name)
    const existingMachine = await MachineryPart.findOne({ name });
    if (existingMachine) {
      return res.status(409).json({ success: false, message: 'Machinery with this name already exists!' });
    }

    const newMachine = new MachineryPart({
      name,
      type,
      quantity,
      price,
      description,
    });

    const savedMachine = await newMachine.save();
    res.status(201).json({ success: true, data: savedMachine });
  } catch (error) {
    console.error('Error creating machinery:', error);
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else {
        res.status(500).json({ success: false, error: 'Server error creating machinery' });
    }
  }
};

// Update a machinery part (PUT - replace)
exports.updateMachinery = async (req, res) => {
  try {
    const { name, type, quantity, price, description } = req.body;

    // Basic validation example for PUT
    if (!name || !type || quantity == null || price == null) {
        return res.status(400).json({ success: false, message: 'Missing required fields for update: name, type, quantity, price' });
    }

    const machine = await MachineryPart.findByIdAndUpdate(
      req.params.id,
      { name, type, quantity, price, description }, // Full replacement
      { new: true, runValidators: true, overwrite: true }
    );

    if (!machine) {
      return res.status(404).json({ success: false, error: 'Machinery not found' });
    }
    res.status(200).json({ success: true, data: machine });
  } catch (error) {
    console.error('Error updating machinery (PUT):', error);
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else if (error.name === 'CastError') {
        res.status(400).json({ success: false, error: 'Invalid ID format' });
    } else {
        res.status(500).json({ success: false, error: 'Server error updating machinery' });
    }
  }
};

// Delete a machinery part
exports.deleteMachinery = async (req, res) => {
  try {
    const machine = await MachineryPart.findByIdAndDelete(req.params.id);
    if (!machine) {
      return res.status(404).json({ success: false, error: 'Machinery not found' });
    }
    res.status(200).json({ success: true, message: 'Machinery deleted successfully', data: {} });
  } catch (error) {
    console.error('Error deleting machinery:', error);
     if (error.name === 'CastError') {
        return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error deleting machinery' });
  }
};

// Search machinery parts
exports.searchMachinery = async (req, res) => {
  try {
    const { name, type, minQuantity, page = 1, limit = 10, sort = 'name', order = 'asc' } = req.query;
    let query = {};

    if (name) query.name = { $regex: name, $options: 'i' };
    if (type) query.type = { $regex: type, $options: 'i' };
    if (minQuantity) query.quantity = { $gte: parseInt(minQuantity) };

    // Pagination, Sorting, Limiting
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const maxLimit = 100;
    const effectiveLimit = Math.min(limitNum, maxLimit);
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const totalMatchingMachinery = await MachineryPart.countDocuments(query);
    const machines = await MachineryPart.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(effectiveLimit);

    res.status(200).json({
        success: true,
        total: totalMatchingMachinery,
        page: pageNum,
        limit: effectiveLimit,
        totalPages: Math.ceil(totalMatchingMachinery / effectiveLimit),
        count: machines.length,
        data: machines
    });
  } catch (error) {
    console.error('Error searching machinery:', error);
    res.status(500).json({ success: false, error: 'Server error searching machinery: ' + error.message });
  }
};

// HEAD request for all machinery
exports.headMachinery = async (req, res) => {
  try {
    const count = await MachineryPart.countDocuments();
    res.set('X-Total-Count', count.toString());
    res.set('X-Resource-Type', 'Machinery');
    res.status(200).end();
  } catch (error) {
    console.error('Error handling HEAD for machinery:', error);
    res.status(500).end();
  }
};

// OPTIONS request for machinery collection
exports.getMachineryOptions = (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS');
  res.status(200).end();
};

// HEAD request for single machinery part
exports.headMachineryById = async (req, res) => {
  try {
    const machine = await MachineryPart.findById(req.params.id).select('updatedAt createdAt');
    if (!machine) {
      return res.status(404).end();
    }
    res.set('X-Resource-Type', 'MachineryPart');
    const lastModified = machine.updatedAt || machine.createdAt;
    if (lastModified) {
        res.set('Last-Modified', lastModified.toUTCString());
    }
    res.status(200).end();
  } catch (error) {
    console.error('Error handling HEAD for single machinery:', error);
    if (error.name === 'CastError') {
        return res.status(400).end();
    }
    res.status(500).end();
  }
};

// OPTIONS request for single machinery part
exports.getMachineryIdOptions = (req, res) => {
  res.set('Allow', 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS');
  res.status(200).end();
};

// PATCH a machinery part - partial update
exports.patchMachinery = async (req, res) => {
  try {
    if (req.body._id) delete req.body._id;

    const machine = await MachineryPart.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true, context: 'query' }
    );

    if (!machine) {
      return res.status(404).json({ success: false, error: 'Machinery not found' });
    }
    res.status(200).json({ success: true, data: machine });
  } catch (error) {
    console.error('Error patching machinery:', error);
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else if (error.name === 'CastError') {
        res.status(400).json({ success: false, error: 'Invalid ID format' });
    } else {
        res.status(500).json({ success: false, error: 'Server error patching machinery' });
    }
  }
};
