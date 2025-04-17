const Admin = require("../models/admin");

// Get all administrators with pagination, sorting and filtering
exports.getAllAdmins = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      ...filterParams
    } = req.query;

    // Build query from filter parameters
    const query = {};
    for (const [key, value] of Object.entries(filterParams)) {
      // Handle numeric ranges with comma-separated values (min,max)
      if (
        value.includes(",") &&
        !isNaN(value.split(",")[0]) &&
        !isNaN(value.split(",")[1])
      ) {
        const [min, max] = value.split(",").map(Number);
        query[key] = { $gte: min, $lte: max };
      }
      // Handle text search with regex
      else if (typeof value === "string") {
        query[key] = { $regex: value, $options: "i" };
      }
      // Handle other cases
      else {
        query[key] = value;
      }
    }

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort direction
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination and sorting
    const admins = await Admin.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    // Get total count for pagination metadata
    const total = await Admin.countDocuments(query);

    res.status(200).json({
      success: true,
      count: admins.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get a single administrator by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Administrator not found",
      });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Create a new administrator
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
      // Add password field if required
    } = req.body;

    // Check if admin already exists (using email as unique identifier)
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Administrator with this email already exists",
      });
    }

    const admin = await Admin.create({
      firstName,
      lastName,
      DOB,
      phoneNumber,
      email,
      salary,
      portfolio,
      dateEmployed,
      // password: hashedPassword, // If implementing authentication
    });

    res.status(201).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    // Differentiate between validation errors and server errors
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(500).json({
        success: false,
        error: "Server error during administrator creation",
      });
    }
  }
};

// Bulk create administrators
exports.bulkCreateAdmins = async (req, res) => {
  try {
    // Validate that the body is an array
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        error: "Request body should be an array of administrators",
      });
    }

    // Use insertMany for bulk operation
    const admins = await Admin.insertMany(req.body, {
      ordered: false, // Continues inserting documents even if one fails
      rawResult: true, // Returns additional info about the operation
    });

    res.status(201).json({
      success: true,
      inserted: admins.insertedCount,
      data: admins.ops, // The inserted documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update an administrator (PUT - replace)
exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the modified document
      runValidators: true, // Run model validation
      overwrite: true, // Ensures it's a PUT (replace) operation
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Administrator not found",
      });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(500).json({
        success: false,
        error: "Server error during administrator update",
      });
    }
  }
};

// Delete an administrator
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Administrator not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Administrator deleted successfully",
      data: {}, // Optionally return the deleted object or empty object
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Bulk delete administrators
exports.bulkDeleteAdmins = async (req, res) => {
  try {
    // Check if we have an array of IDs
    if (!Array.isArray(req.body.ids)) {
      return res.status(400).json({
        success: false,
        error: "Request body should contain an array of IDs to delete",
      });
    }

    const result = await Admin.deleteMany({ _id: { $in: req.body.ids } });

    res.status(200).json({
      success: true,
      deleted: result.deletedCount,
      message: `${result.deletedCount} administrators deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Advanced search administrators with complex queries
exports.searchAdmins = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      minSalary,
      maxSalary,
      query = {},
    } = req.query;

    // Build the query object for MongoDB
    if (firstName) query.firstName = { $regex: firstName, $options: "i" };
    if (lastName) query.lastName = { $regex: lastName, $options: "i" };
    if (email) query.email = { $regex: email, $options: "i" };

    // Add salary range query if provided
    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.$gte = parseFloat(minSalary);
      if (maxSalary) query.salary.$lte = parseFloat(maxSalary);
    }

    // Handle pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Handle sorting
    const sortField = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const sort = {};
    sort[sortField] = sortOrder;

    // Execute query with cursor for efficient large result handling
    const cursor = Admin.find(query).sort(sort).cursor();

    const admins = [];
    let count = 0;

    // Skip documents for pagination
    for (let i = 0; i < skip; i++) {
      const hasNext = await cursor.next();
      if (!hasNext) break;
    }

    // Fetch limited number of documents
    for (let i = 0; i < limit; i++) {
      const admin = await cursor.next();
      if (!admin) break;
      admins.push(admin);
      count++;
    }

    // Get total count for pagination
    const total = await Admin.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Aggregation endpoints

// Get administrator statistics
exports.getAdminStats = async (req, res) => {
  try {
    const stats = await Admin.aggregate([
      {
        $group: {
          _id: null,
          totalAdmins: { $sum: 1 },
          avgSalary: { $avg: "$salary" },
          minSalary: { $min: "$salary" },
          maxSalary: { $max: "$salary" },
          totalSalary: { $sum: "$salary" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// HEAD request for all administrators
exports.headAdmins = async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    res.set("X-Total-Count", count.toString());
    res.set("X-Resource-Type", "Administrators");
    // Add cache control headers
    res.set("Cache-Control", "max-age=60"); // Cache for 60 seconds
    res.status(200).end();
  } catch (error) {
    res.status(500).end(); // HEAD should not return a body on error
  }
};

// OPTIONS request for administrators collection
exports.getAdminOptions = (req, res) => {
  res.set("Allow", "GET, POST, HEAD, OPTIONS");
  res.status(200).end();
};

// HEAD request for single administrator
exports.headAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select(
      "updatedAt createdAt"
    );

    if (!admin) {
      return res.status(404).end();
    }

    res.set("X-Resource-Type", "Administrator");
    if (admin.updatedAt) {
      res.set("Last-Modified", admin.updatedAt.toUTCString());
    } else if (admin.createdAt) {
      res.set("Last-Modified", admin.createdAt.toUTCString());
    }

    // Add ETag based on updatedAt or version field
    const etag = `"${admin._id.toString()}-${new Date(
      admin.updatedAt || admin.createdAt
    ).getTime()}"`;
    res.set("ETag", etag);

    res.status(200).end();
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).end(); // Invalid ID format
    }
    res.status(500).end();
  }
};

// OPTIONS request for single administrator
exports.getAdminIdOptions = (req, res) => {
  res.set("Allow", "GET, PUT, DELETE, PATCH, HEAD, OPTIONS");
  res.status(200).end();
};

// PATCH an administrator - partial update
exports.patchAdmin = async (req, res) => {
  try {
    // Prevent overwriting the entire document with patch
    if (req.body._id) delete req.body._id; // Cannot update _id

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Use $set to apply partial updates
      {
        new: true, // Return the modified document
        runValidators: true, // Run model validation on updated fields
        context: "query", // Important for some validators
      }
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Administrator not found",
      });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(500).json({
        success: false,
        error: "Server error during administrator patch",
      });
    }
  }
};
