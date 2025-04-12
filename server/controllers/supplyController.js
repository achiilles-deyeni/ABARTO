const Supplier = require('../models/Suppliers'); // Corrected path and assumed model name

// Get all supplies (assuming this means Suppliers now)
exports.getAllSupplies = async (req, res) => {
  try {
    // Pagination, Sorting, Limiting
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort || 'name'; // Default sort
    const order = req.query.order || 'asc';
    const skip = (page - 1) * limit;
    const maxLimit = 100;
    const effectiveLimit = Math.min(limit, maxLimit);
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const totalSuppliers = await Supplier.countDocuments();
    const suppliers = await Supplier.find() // Use correct model name
      .sort(sortOptions)
      .skip(skip)
      .limit(effectiveLimit);

    res.status(200).json({
        success: true,
        total: totalSuppliers,
        page: page,
        limit: effectiveLimit,
        totalPages: Math.ceil(totalSuppliers / effectiveLimit),
        count: suppliers.length,
        data: suppliers
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error); // Updated log message
    res.status(500).json({ success: false, error: 'Server error fetching suppliers: ' + error.message }); // Updated error message
  }
};

// Get supply (Supplier) by ID
exports.getSupplyById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, error: 'Supplier not found' }); // Updated message
    }
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    console.error('Error fetching supplier by ID:', error);
    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error fetching supplier' }); // Updated message
  }
};

// Create new supply (Supplier)
exports.createSupply = async (req, res) => {
  try {
    // Adjust fields based on Suppliers.js model (name, contactPerson, email, phone, address)
    const { name, contactPerson, email, phone, address } = req.body;
    if (!name || !email) { // Basic validation for Supplier
      return res.status(400).json({ success: false, message: 'Missing required fields: name, email' });
    }

    const newSupplier = new Supplier({
        name,
        contactPerson,
        email,
        phone,
        address
    });
    const savedSupplier = await newSupplier.save();
    res.status(201).json({ success: true, data: savedSupplier });
  } catch (error) {
    console.error('Error creating supplier:', error);
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else {
        res.status(500).json({ success: false, error: 'Server error creating supplier' });
    }
  }
};

// Update supply (Supplier) (PUT - replace)
exports.updateSupply = async (req, res) => {
  try {
    const { name, contactPerson, email, phone, address } = req.body;
     if (!name || !email) { // Basic PUT validation
      return res.status(400).json({ success: false, message: 'Missing required fields for update: name, email' });
    }

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { name, contactPerson, email, phone, address },
      { new: true, runValidators: true, overwrite: true }
    );
    if (!supplier) {
      return res.status(404).json({ success: false, error: 'Supplier not found' });
    }
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    console.error('Error updating supplier (PUT):', error);
     if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
     } else if (error.name === 'CastError') {
        res.status(400).json({ success: false, error: 'Invalid ID format' });
     } else {
        res.status(500).json({ success: false, error: 'Server error updating supplier' });
     }
  }
};

// Patch supply (Supplier) (PATCH - partial update)
exports.patchSupply = async (req, res) => {
  try {
    if (req.body._id) delete req.body._id;
    const supplier = await Supplier.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true, context: 'query' }
    );
    if (!supplier) {
      return res.status(404).json({ success: false, error: 'Supplier not found' });
    }
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    console.error('Error patching supplier:', error);
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else if (error.name === 'CastError') {
        res.status(400).json({ success: false, error: 'Invalid ID format' });
    } else {
        res.status(500).json({ success: false, error: 'Server error patching supplier' });
    }
  }
};

// Delete supply (Supplier)
exports.deleteSupply = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, error: 'Supplier not found' });
    }
    res.status(200).json({ success: true, message: 'Supplier deleted successfully', data: {} });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error deleting supplier' });
  }
};

// Search supplies (Suppliers)
exports.searchSupplies = async (req, res) => {
  try {
    // Adjust search fields based on Supplier model
    const { name, email, contactPerson, page = 1, limit = 10, sort = 'name', order = 'asc' } = req.query;
    let query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (email) query.email = { $regex: email, $options: 'i' };
    if (contactPerson) query.contactPerson = { $regex: contactPerson, $options: 'i' };

    // Pagination, Sorting, Limiting
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const maxLimit = 100;
    const effectiveLimit = Math.min(limitNum, maxLimit);
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const totalMatchingSuppliers = await Supplier.countDocuments(query);
    const suppliers = await Supplier.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(effectiveLimit);

    res.status(200).json({
        success: true,
        total: totalMatchingSuppliers,
        page: pageNum,
        limit: effectiveLimit,
        totalPages: Math.ceil(totalMatchingSuppliers / effectiveLimit),
        count: suppliers.length,
        data: suppliers
    });
  } catch (error) {
    console.error('Error searching suppliers:', error);
    res.status(500).json({ success: false, error: 'Server error searching suppliers: ' + error.message });
  }
};

// HEAD request for all supplies (Suppliers)
exports.headSupplies = async (req, res) => {
  try {
    const count = await Supplier.countDocuments();
    res.set('X-Total-Count', count.toString());
    res.set('X-Resource-Type', 'Suppliers'); // Updated type
    res.status(200).end();
  } catch (error) {
    console.error('Error handling HEAD for suppliers:', error);
    res.status(500).end();
  }
};

// OPTIONS request for supplies (Suppliers) collection
exports.getSupplyOptions = (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS');
  res.status(200).end();
};

// HEAD request for single supply (Supplier)
exports.headSupply = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).select('updatedAt createdAt');
    if (!supplier) {
      return res.status(404).end();
    }
    res.set('X-Resource-Type', 'Supplier'); // Updated type
    const lastModified = supplier.updatedAt || supplier.createdAt;
    if (lastModified) {
        res.set('Last-Modified', lastModified.toUTCString());
    }
    res.status(200).end();
  } catch (error) {
    console.error('Error handling HEAD for single supplier:', error);
    if (error.name === 'CastError') {
        return res.status(400).end();
    }
    res.status(500).end();
  }
};

// OPTIONS request for single supply (Supplier)
exports.getSupplyIdOptions = (req, res) => {
  res.set('Allow', 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS');
  res.status(200).end();
};