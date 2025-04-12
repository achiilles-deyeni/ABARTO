const ChemicalCompound = require('../models/chemicalCompound');

// Get all chemical compounds
exports.getAllChemicals = async (req, res) => {
  try {
    // Pagination, Sorting, Limiting
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort || 'compoundName'; // Default sort
    const order = req.query.order || 'asc';
    const skip = (page - 1) * limit;
    const maxLimit = 100;
    const effectiveLimit = Math.min(limit, maxLimit);
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const totalChemicals = await ChemicalCompound.countDocuments();
    const chemicals = await ChemicalCompound.find()
      .sort(sortOptions)
      .skip(skip)
      .limit(effectiveLimit);

    res.status(200).json({
      success: true,
      total: totalChemicals,
      page: page,
      limit: effectiveLimit,
      totalPages: Math.ceil(totalChemicals / effectiveLimit),
      count: chemicals.length,
      data: chemicals
    });
  } catch (error) {
    console.error('Error fetching chemicals:', error);
    res.status(500).json({ success: false, error: 'Server error fetching chemicals: ' + error.message });
  }
};

// Get chemical compound by ID
exports.getChemicalById = async (req, res) => {
  try {
    const chemical = await ChemicalCompound.findById(req.params.id);
    if (!chemical) {
      return res.status(404).json({ success: false, error: 'Chemical compound not found' });
    }
    res.status(200).json({ success: true, data: chemical });
  } catch (error) {
    console.error('Error fetching chemical by ID:', error);
    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error fetching chemical' });
  }
};

// Create new chemical compound
exports.createChemical = async (req, res) => {
  try {
    const { compoundName, formula, quantity, unit, storageLocation, safetySheetUrl } = req.body;
    if (!compoundName || !formula || quantity == null || !unit) {
      return res.status(400).json({ success: false, message: 'Missing required fields: compoundName, formula, quantity, unit' });
    }

    const newChemical = new ChemicalCompound({
      compoundName,
      formula,
      quantity,
      unit,
      storageLocation,
      safetySheetUrl
    });
    const savedChemical = await newChemical.save();
    res.status(201).json({ success: true, data: savedChemical });
  } catch (error) {
    console.error('Error creating chemical:', error);
     if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else {
        res.status(500).json({ success: false, error: 'Server error creating chemical' });
    }
  }
};

// Update chemical compound (PUT - replace)
exports.updateChemical = async (req, res) => {
  try {
    const { compoundName, formula, quantity, unit, storageLocation, safetySheetUrl } = req.body;
     if (!compoundName || !formula || quantity == null || !unit) { // Basic PUT validation
       return res.status(400).json({ success: false, message: 'Missing required fields for update' });
     }

    const chemical = await ChemicalCompound.findByIdAndUpdate(
      req.params.id,
      { compoundName, formula, quantity, unit, storageLocation, safetySheetUrl },
      { new: true, runValidators: true, overwrite: true }
    );
    if (!chemical) {
      return res.status(404).json({ success: false, error: 'Chemical compound not found' });
    }
    res.status(200).json({ success: true, data: chemical });
  } catch (error) {
    console.error('Error updating chemical (PUT):', error);
     if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
     } else if (error.name === 'CastError') {
        res.status(400).json({ success: false, error: 'Invalid ID format' });
     } else {
        res.status(500).json({ success: false, error: 'Server error updating chemical' });
     }
  }
};

// Patch chemical compound (PATCH - partial update)
exports.patchChemical = async (req, res) => {
  try {
    if (req.body._id) delete req.body._id;

    const chemical = await ChemicalCompound.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true, context: 'query' }
    );
    if (!chemical) {
      return res.status(404).json({ success: false, error: 'Chemical compound not found' });
    }
    res.status(200).json({ success: true, data: chemical });
  } catch (error) {
    console.error('Error patching chemical:', error);
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else if (error.name === 'CastError') {
        res.status(400).json({ success: false, error: 'Invalid ID format' });
    } else {
        res.status(500).json({ success: false, error: 'Server error patching chemical' });
    }
  }
};

// Delete chemical compound
exports.deleteChemical = async (req, res) => {
  try {
    const chemical = await ChemicalCompound.findByIdAndDelete(req.params.id);
    if (!chemical) {
      return res.status(404).json({ success: false, error: 'Chemical compound not found' });
    }
    res.status(200).json({ success: true, message: 'Chemical compound deleted successfully', data: {} });
  } catch (error) {
    console.error('Error deleting chemical:', error);
    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error deleting chemical' });
  }
};

// Search chemical compounds
exports.searchChemicals = async (req, res) => {
  try {
    const { compoundName, formula, storageLocation, page = 1, limit = 10, sort = 'compoundName', order = 'asc' } = req.query;
    let query = {};
    if (compoundName) query.compoundName = { $regex: compoundName, $options: 'i' };
    if (formula) query.formula = { $regex: formula, $options: 'i' }; // Case-sensitive might be better for formula
    if (storageLocation) query.storageLocation = { $regex: storageLocation, $options: 'i' };

    // Pagination, Sorting, Limiting
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const maxLimit = 100;
    const effectiveLimit = Math.min(limitNum, maxLimit);
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const totalMatchingChemicals = await ChemicalCompound.countDocuments(query);
    const chemicals = await ChemicalCompound.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(effectiveLimit);

    res.status(200).json({
        success: true,
        total: totalMatchingChemicals,
        page: pageNum,
        limit: effectiveLimit,
        totalPages: Math.ceil(totalMatchingChemicals / effectiveLimit),
        count: chemicals.length,
        data: chemicals
    });
  } catch (error) {
    console.error('Error searching chemicals:', error);
    res.status(500).json({ success: false, error: 'Server error searching chemicals: ' + error.message });
  }
};

// HEAD request for all chemical compounds
exports.headChemicals = async (req, res) => {
  try {
    const count = await ChemicalCompound.countDocuments();
    res.set('X-Total-Count', count.toString());
    res.set('X-Resource-Type', 'ChemicalCompounds');
    res.status(200).end();
  } catch (error) {
    console.error('Error handling HEAD for chemicals:', error);
    res.status(500).end();
  }
};

// OPTIONS request for chemical compounds collection
exports.getChemicalOptions = (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS');
  res.status(200).end();
};

// HEAD request for single chemical compound
exports.headChemical = async (req, res) => {
  try {
    const chemical = await ChemicalCompound.findById(req.params.id).select('updatedAt createdAt');
    if (!chemical) {
      return res.status(404).end();
    }
    res.set('X-Resource-Type', 'ChemicalCompound');
    const lastModified = chemical.updatedAt || chemical.createdAt;
    if (lastModified) {
        res.set('Last-Modified', lastModified.toUTCString());
    }
    res.status(200).end();
  } catch (error) {
    console.error('Error handling HEAD for single chemical:', error);
     if (error.name === 'CastError') {
        return res.status(400).end();
    }
    res.status(500).end();
  }
};

// OPTIONS request for single chemical compound
exports.getChemicalIdOptions = (req, res) => {
  res.set('Allow', 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS');
  res.status(200).end();
};
