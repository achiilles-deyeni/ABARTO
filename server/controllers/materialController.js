const RawMaterial = require('../models/rawMaterial'); // Corrected path

// Get all materials
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await RawMaterial.find();
    res.status(200).json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get a single material by ID
exports.getMaterialById = async (req, res) => {
  try {
    const material = await RawMaterial.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }

    res.status(200).json({
      success: true,
      data: material
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create a new material
exports.createMaterial = async (req, res) => {
  try {
    // Assuming fields like name, description, supplier, quantity, unitCost
    const { name, description, supplier, quantity, unitCost } = req.body;

    // Optional: Check if material already exists
    const existingMaterial = await RawMaterial.findOne({ name }); // Example check by name
    if (existingMaterial) {
      return res.status(409).json({ // 409 Conflict is suitable here
        success: false,
        message: "Material with this name already exists!"
      });
    }

    const material = await RawMaterial.create({
        name,
        description,
        supplier,
        quantity,
        unitCost
    });

    res.status(201).json({
      success: true,
      data: material
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else {
        console.error('Error creating material:', error); // Log the actual error
        res.status(500).json({ success: false, error: 'Server error during material creation' });
    }
  }
};

// Update a material (PUT - replace)
exports.updateMaterial = async (req, res) => {
  try {
    const material = await RawMaterial.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        overwrite: true
      }
    );

    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }

    res.status(200).json({
      success: true,
      data: material
    });
  } catch (error) {
     if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
     } else {
        console.error('Error updating material (PUT):', error);
        res.status(500).json({ success: false, error: 'Server error during material update' });
     }
  }
};

// Delete a material
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await RawMaterial.findByIdAndDelete(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }

    res.status(200).json({
      success: true,
      message: "Material deleted successfully",
      data: {}
    });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during material deletion'
    });
  }
};

// Search materials
exports.searchMaterials = async (req, res) => {
  try {
    const { name, supplier, minQuantity } = req.query;
    let query = {};

    if (name) query.name = { $regex: name, $options: 'i' };
    if (supplier) query.supplier = { $regex: supplier, $options: 'i' };
    if (minQuantity) query.quantity = { $gte: parseInt(minQuantity) };

    const materials = await RawMaterial.find(query);

    res.status(200).json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (error) {
    console.error('Error searching materials:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during material search'
    });
  }
};

// HEAD request for all materials
exports.headMaterials = async (req, res) => {
  try {
    const count = await RawMaterial.countDocuments();
    res.set('X-Total-Count', count.toString());
    res.set('X-Resource-Type', 'Materials');
    res.status(200).end();
  } catch (error) {
    console.error('Error handling HEAD request for materials:', error);
    res.status(500).end();
  }
};

// OPTIONS request for materials collection
exports.getMaterialOptions = (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS');
  res.status(200).end();
};

// HEAD request for single material
exports.headMaterial = async (req, res) => {
  try {
    const material = await RawMaterial.findById(req.params.id).select('updatedAt createdAt');

    if (!material) {
      return res.status(404).end();
    }

    res.set('X-Resource-Type', 'Material');
    const lastModified = material.updatedAt || material.createdAt;
    if (lastModified) {
        res.set('Last-Modified', lastModified.toUTCString());
    }
    res.status(200).end();
  } catch (error) {
    console.error('Error handling HEAD request for single material:', error);
    res.status(500).end();
  }
};

// OPTIONS request for single material
exports.getMaterialIdOptions = (req, res) => {
  res.set('Allow', 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS');
  res.status(200).end();
};

// PATCH a material - partial update
exports.patchMaterial = async (req, res) => {
  try {
    if (req.body._id) delete req.body._id;

    const material = await RawMaterial.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        {
            new: true,
            runValidators: true,
            context: 'query'
        }
    );

    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }

    res.status(200).json({
      success: true,
      data: material
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else {
        console.error('Error patching material:', error);
        res.status(500).json({ success: false, error: 'Server error during material patch' });
    }
  }
};
