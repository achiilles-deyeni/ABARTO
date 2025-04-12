const SafetyEquipment = require('../models/safetyEquipment');

// Get all safety equipment items
exports.getAllSafetyItems = async (req, res) => {
  try {
    const items = await SafetyEquipment.find();
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error('Error fetching safety equipment:', error);
    res.status(500).json({ success: false, error: 'Server error fetching safety equipment' });
  }
};

// Get safety equipment item by ID
exports.getSafetyItemById = async (req, res) => {
  try {
    const item = await SafetyEquipment.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Safety equipment not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error('Error fetching safety equipment by ID:', error);
    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error fetching safety equipment' });
  }
};

// Create new safety equipment item
exports.createSafetyItem = async (req, res) => {
  try {
    const { equipmentName, lastInspectionDate, nextInspectionDate, status, location } = req.body;
    if (!equipmentName || !nextInspectionDate || !status) {
      return res.status(400).json({ success: false, message: 'Missing required fields: equipmentName, nextInspectionDate, status' });
    }

    const newItem = new SafetyEquipment({
      equipmentName,
      lastInspectionDate: lastInspectionDate || null,
      nextInspectionDate,
      status,
      location
    });
    const savedItem = await newItem.save();
    res.status(201).json({ success: true, data: savedItem });
  } catch (error) {
    console.error('Error creating safety equipment:', error);
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else {
        res.status(500).json({ success: false, error: 'Server error creating safety equipment' });
    }
  }
};

// Update safety equipment item (PUT - replace)
exports.updateSafetyItem = async (req, res) => {
  try {
    const { equipmentName, lastInspectionDate, nextInspectionDate, status, location } = req.body;
     if (!equipmentName || !nextInspectionDate || !status) { // Basic PUT validation
       return res.status(400).json({ success: false, message: 'Missing required fields for update' });
     }

    const item = await SafetyEquipment.findByIdAndUpdate(
      req.params.id,
      { equipmentName, lastInspectionDate, nextInspectionDate, status, location },
      { new: true, runValidators: true, overwrite: true }
    );
    if (!item) {
      return res.status(404).json({ success: false, error: 'Safety equipment not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error('Error updating safety equipment (PUT):', error);
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
     } else if (error.name === 'CastError') {
        res.status(400).json({ success: false, error: 'Invalid ID format' });
     } else {
        res.status(500).json({ success: false, error: 'Server error updating safety equipment' });
     }
  }
};

// Patch safety equipment item (PATCH - partial update)
exports.patchSafetyItem = async (req, res) => {
  try {
    if (req.body._id) delete req.body._id;

    const item = await SafetyEquipment.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true, context: 'query' }
    );
    if (!item) {
      return res.status(404).json({ success: false, error: 'Safety equipment not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error('Error patching safety equipment:', error);
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else if (error.name === 'CastError') {
        res.status(400).json({ success: false, error: 'Invalid ID format' });
    } else {
        res.status(500).json({ success: false, error: 'Server error patching safety equipment' });
    }
  }
};

// Delete safety equipment item
exports.deleteSafetyItem = async (req, res) => {
  try {
    const item = await SafetyEquipment.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Safety equipment not found' });
    }
    res.status(200).json({ success: true, message: 'Safety equipment deleted successfully', data: {} });
  } catch (error) {
    console.error('Error deleting safety equipment:', error);
    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error deleting safety equipment' });
  }
};

// Search safety equipment items
exports.searchSafetyItems = async (req, res) => {
  try {
    const { equipmentName, status, location, inspectionDueBefore } = req.query;
    let query = {};
    if (equipmentName) query.equipmentName = { $regex: equipmentName, $options: 'i' };
    if (status) query.status = status;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (inspectionDueBefore) {
        query.nextInspectionDate = { $lte: new Date(inspectionDueBefore) };
    }

    const items = await SafetyEquipment.find(query).sort({ nextInspectionDate: 1 }); // Sort by next inspection due
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error('Error searching safety equipment:', error);
    res.status(500).json({ success: false, error: 'Server error searching safety equipment' });
  }
};

// HEAD request for all safety equipment items
exports.headSafetyItems = async (req, res) => {
  try {
    const count = await SafetyEquipment.countDocuments();
    res.set('X-Total-Count', count.toString());
    res.set('X-Resource-Type', 'SafetyEquipment');
    res.status(200).end();
  } catch (error) {
    console.error('Error handling HEAD for safety equipment:', error);
    res.status(500).end();
  }
};

// OPTIONS request for safety equipment collection
exports.getSafetyOptions = (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS');
  res.status(200).end();
};

// HEAD request for single safety equipment item
exports.headSafetyItem = async (req, res) => {
  try {
    const item = await SafetyEquipment.findById(req.params.id).select('updatedAt createdAt lastInspectionDate');
    if (!item) {
      return res.status(404).end();
    }
    res.set('X-Resource-Type', 'SafetyEquipment');
    // Use updatedAt, createdAt, or lastInspectionDate for Last-Modified header
    const lastModified = item.updatedAt || item.createdAt || item.lastInspectionDate;
    if (lastModified) {
        res.set('Last-Modified', lastModified.toUTCString());
    }
    res.status(200).end();
  } catch (error) {
    console.error('Error handling HEAD for single safety equipment:', error);
     if (error.name === 'CastError') {
        return res.status(400).end();
    }
    res.status(500).end();
  }
};

// OPTIONS request for single safety equipment item
exports.getSafetyIdOptions = (req, res) => {
  res.set('Allow', 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS');
  res.status(200).end();
};
