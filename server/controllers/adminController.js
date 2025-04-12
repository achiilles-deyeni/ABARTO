const Admin = require('../models/admin');

// Get all administrators
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ success: false, error: 'Server error fetching administrators' });
  }
};

// Get a single administrator by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Administrator not found' });
    }
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    console.error('Error fetching admin by ID:', error);
    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error fetching administrator' });
  }
};

// Create a new administrator (Register)
exports.createAdmin = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      DOB,
      phoneNumber,
      email,
      salary,
      portfolio,
      dateEmployed,
      // Add password handling if required for admins
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ success: false, message: 'Missing required fields: firstName, lastName, email' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ success: false, message: 'Administrator with this email already exists' });
    }

    // Add password hashing here if implementing authentication
    // const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newAdmin = new Admin({
      firstName,
      lastName,
      DOB,
      phoneNumber,
      email,
      salary,
      portfolio,
      dateEmployed,
      // password: hashedPassword,
    });

    const savedAdmin = await newAdmin.save();
    // Avoid sending back sensitive info like password hash
    const resultAdmin = savedAdmin.toObject();
    // delete resultAdmin.password;

    res.status(201).json({ success: true, data: resultAdmin });
  } catch (error) {
    console.error('Error creating admin:', error);
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else {
        res.status(500).json({ success: false, error: 'Server error creating administrator' });
    }
  }
};

// Update an administrator (PUT - replace)
exports.updateAdmin = async (req, res) => {
  try {
     const { /* Extract all expected fields for PUT */ } = req.body;
     // Add validation to ensure all required fields are present for PUT

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body, // Requires full object for replacement
      { new: true, runValidators: true, overwrite: true }
    );

    if (!admin) {
      return res.status(404).json({ success: false, error: 'Administrator not found' });
    }
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    console.error('Error updating admin (PUT):', error);
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else if (error.name === 'CastError') {
        res.status(400).json({ success: false, error: 'Invalid ID format' });
    } else {
        res.status(500).json({ success: false, error: 'Server error updating administrator' });
    }
  }
};

// Delete an administrator
exports.deleteAdmin = async (req, res) => {
  try {
    // Need to await the findByIdAndDelete
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
        // Use 404 for not found, not 500
      return res.status(404).json({ success: false, error: 'Administrator not found' });
    }
    // Use 200 OK or 204 No Content for successful deletion
    res.status(200).json({ success: true, message: 'Administrator deleted successfully', data: {} });
  } catch (error) {
    console.error('Error deleting admin:', error);
     if (error.name === 'CastError') {
        return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, error: 'Server error deleting administrator' });
  }
};

// Search administrators
exports.searchAdmins = async (req, res) => {
  try {
    const { email, lastName, firstName } = req.query;
    let query = {};

    if (email) query.email = { $regex: email, $options: 'i' };
    if (lastName) query.lastName = { $regex: lastName, $options: 'i' };
    if (firstName) query.firstName = { $regex: firstName, $options: 'i' };

    const admins = await Admin.find(query);
    res.status(200).json({ success: true, count: admins.length, data: admins });
  } catch (error) {
    console.error('Error searching admins:', error);
    res.status(500).json({ success: false, error: 'Server error searching administrators' });
  }
};

// HEAD request for all admins
exports.headAdmins = async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    res.set('X-Total-Count', count.toString());
    res.set('X-Resource-Type', 'Administrators');
    res.status(200).end();
  } catch (error) {
    console.error('Error handling HEAD for admins:', error);
    res.status(500).end();
  }
};

// OPTIONS request for admin collection
exports.getAdminOptions = (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS');
  res.status(200).end();
};

// HEAD request for single admin
exports.headAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('updatedAt createdAt');
    if (!admin) {
      return res.status(404).end();
    }
    res.set('X-Resource-Type', 'Administrator');
    const lastModified = admin.updatedAt || admin.createdAt;
    if (lastModified) {
        res.set('Last-Modified', lastModified.toUTCString());
    }
    res.status(200).end();
  } catch (error) {
    console.error('Error handling HEAD for single admin:', error);
    if (error.name === 'CastError') {
        return res.status(400).end();
    }
    res.status(500).end();
  }
};

// OPTIONS request for single admin
exports.getAdminIdOptions = (req, res) => {
  res.set('Allow', 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS');
  res.status(200).end();
};

// PATCH an administrator - partial update
exports.patchAdmin = async (req, res) => {
  try {
    // Logic from original routes file, adapted
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Administrator not found' });
    }

    // Apply updates from req.body
    Object.keys(req.body).forEach(key => {
      // Prevent updating _id or potentially password directly via PATCH without hashing
      if (key !== '_id' /* && key !== 'password' */ ) {
          admin[key] = req.body[key];
      }
    });

    // If password is in body, handle hashing separately if needed
    // if (req.body.password) { ... hash and set admin.password ... }

    const updatedAdmin = await admin.save(); // Use save() to trigger Mongoose middleware/validation

    res.status(200).json({ success: true, data: updatedAdmin });
  } catch (error) {
    console.error('Error patching admin:', error);
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else if (error.name === 'CastError') {
        res.status(400).json({ success: false, error: 'Invalid ID format' });
    } else {
        res.status(500).json({ success: false, error: 'Server error patching administrator' });
    }
  }
};
