const ChemicalCompound = require("../models/chemicalCompound");

// Get all chemical compounds with pagination, sorting and filtering
exports.getAllChemicals = async (req, res) => {
  try {
<<<<<<< HEAD
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
    const chemicals = await ChemicalCompound.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    // Get total count for pagination metadata
    const total = await ChemicalCompound.countDocuments(query);

    res.status(200).json({
      success: true,
      count: chemicals.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      data: chemicals,
    });
  } catch (error) {
    console.error("Error fetching chemicals:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
=======
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
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11
  }
};

// Get chemical compound by ID
exports.getChemicalById = async (req, res) => {
  try {
    const chemical = await ChemicalCompound.findById(req.params.id);

    if (!chemical) {
      return res.status(404).json({
        success: false,
        error: "Chemical compound not found",
      });
    }

    res.status(200).json({
      success: true,
      data: chemical,
    });
  } catch (error) {
    console.error("Error fetching chemical by ID:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid ID format",
      });
    }
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Create new chemical compound
exports.createChemical = async (req, res) => {
  try {
    const { compoundName, formula, casNumber } = req.body;

    // Check if chemical already exists (using compound name or CAS number as unique identifier)
    let existingQuery = { compoundName };
    if (casNumber) {
      existingQuery = { $or: [{ compoundName }, { casNumber }] };
    }

    const existingChemical = await ChemicalCompound.findOne(existingQuery);
    if (existingChemical) {
      return res.status(409).json({
        success: false,
        message:
          existingChemical.compoundName === compoundName
            ? "Chemical compound with this name already exists"
            : "Chemical compound with this CAS number already exists",
      });
    }

    const chemical = await ChemicalCompound.create(req.body);

    res.status(201).json({
      success: true,
      data: chemical,
    });
  } catch (error) {
    console.error("Error creating chemical:", error);
    // Differentiate between validation errors and server errors
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(500).json({
        success: false,
        error: "Server error during chemical compound creation",
      });
    }
  }
};

// Bulk create chemical compounds
exports.bulkCreateChemicals = async (req, res) => {
  try {
    // Validate that the body is an array
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        error: "Request body should be an array of chemical compounds",
      });
    }

    // Use insertMany for bulk operation
    const result = await ChemicalCompound.insertMany(req.body, {
      ordered: false, // Continues inserting documents even if one fails
      rawResult: true, // Returns additional info about the operation
    });

    res.status(201).json({
      success: true,
      inserted: result.insertedCount,
      data: result.ops, // The inserted documents
    });
  } catch (error) {
    console.error("Error bulk creating chemicals:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update chemical compound (PUT - replace)
exports.updateChemical = async (req, res) => {
  try {
    const chemical = await ChemicalCompound.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the modified document
        runValidators: true, // Run model validation
        overwrite: true, // Ensures it's a PUT (replace) operation
      }
    );

    if (!chemical) {
      return res.status(404).json({
        success: false,
        error: "Chemical compound not found",
      });
    }

    res.status(200).json({
      success: true,
      data: chemical,
    });
  } catch (error) {
    console.error("Error updating chemical (PUT):", error);
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else if (error.name === "CastError") {
      res.status(400).json({ success: false, error: "Invalid ID format" });
    } else {
      res.status(500).json({
        success: false,
        error: "Server error during chemical update",
      });
    }
  }
};

// Delete chemical compound
exports.deleteChemical = async (req, res) => {
  try {
    const chemical = await ChemicalCompound.findByIdAndDelete(req.params.id);

    if (!chemical) {
      return res.status(404).json({
        success: false,
        error: "Chemical compound not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chemical compound deleted successfully",
      data: {}, // Optionally return the deleted object or empty object
    });
  } catch (error) {
    console.error("Error deleting chemical:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid ID format",
      });
    }
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Bulk delete chemical compounds
exports.bulkDeleteChemicals = async (req, res) => {
  try {
    // Check if we have an array of IDs
    if (!Array.isArray(req.body.ids)) {
      return res.status(400).json({
        success: false,
        error: "Request body should contain an array of IDs to delete",
      });
    }

    const result = await ChemicalCompound.deleteMany({
      _id: { $in: req.body.ids },
    });

    res.status(200).json({
      success: true,
      deleted: result.deletedCount,
      message: `${result.deletedCount} chemical compounds deleted successfully`,
    });
  } catch (error) {
    console.error("Error bulk deleting chemicals:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Advanced search chemical compounds with complex queries
exports.searchChemicals = async (req, res) => {
  try {
<<<<<<< HEAD
    const {
      compoundName,
      formula,
      casNumber,
      hazardClass,
      status,
      storageLocation,
      supplier,
      minQuantity,
      maxQuantity,
      expirationBefore,
      expirationAfter,
      query = {},
    } = req.query;

    // Build the query object for MongoDB
    if (compoundName)
      query.compoundName = { $regex: compoundName, $options: "i" };
    if (formula) query.formula = { $regex: formula, $options: "i" };
    if (casNumber) query.casNumber = { $regex: casNumber, $options: "i" };
    if (hazardClass) query.hazardClass = hazardClass;
    if (status) query.status = status;
    if (storageLocation)
      query.storageLocation = { $regex: storageLocation, $options: "i" };
    if (supplier) query.supplier = { $regex: supplier, $options: "i" };

    // Add quantity range query if provided
    if (minQuantity || maxQuantity) {
      query.quantity = {};
      if (minQuantity) query.quantity.$gte = parseFloat(minQuantity);
      if (maxQuantity) query.quantity.$lte = parseFloat(maxQuantity);
    }

    // Add expiration date range query if provided
    if (expirationBefore || expirationAfter) {
      query.expirationDate = {};
      if (expirationAfter)
        query.expirationDate.$gte = new Date(expirationAfter);
      if (expirationBefore)
        query.expirationDate.$lte = new Date(expirationBefore);
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
    const cursor = ChemicalCompound.find(query).sort(sort).cursor();

    const chemicals = [];
    let count = 0;

    // Skip documents for pagination
    for (let i = 0; i < skip; i++) {
      const hasNext = await cursor.next();
      if (!hasNext) break;
    }

    // Fetch limited number of documents
    for (let i = 0; i < limit; i++) {
      const chemical = await cursor.next();
      if (!chemical) break;
      chemicals.push(chemical);
      count++;
    }

    // Get total count for pagination
    const total = await ChemicalCompound.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: chemicals,
    });
  } catch (error) {
    console.error("Error searching chemicals:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get chemical compound statistics
exports.getChemicalStats = async (req, res) => {
  try {
    const stats = await ChemicalCompound.aggregate([
      {
        $group: {
          _id: null,
          totalCompounds: { $sum: 1 },
          uniqueCompounds: { $addToSet: "$compoundName" },
          avgQuantity: { $avg: "$quantity" },
          totalHazardous: {
            $sum: {
              $cond: [{ $ne: ["$hazardClass", "Not hazardous"] }, 1, 0],
            },
          },
          expiredCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "Expired"] }, 1, 0],
            },
          },
          lowStockCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "Low Stock"] }, 1, 0],
            },
          },
          outOfStockCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "Out of Stock"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalCompounds: 1,
          uniqueCompoundCount: { $size: "$uniqueCompounds" },
          avgQuantity: 1,
          totalHazardous: 1,
          expiredCount: 1,
          lowStockCount: 1,
          outOfStockCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {},
    });
  } catch (error) {
    console.error("Error fetching chemical statistics:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get chemical compounds by hazard class with count
exports.getChemicalsByHazardClass = async (req, res) => {
  try {
    const hazardStats = await ChemicalCompound.aggregate([
      {
        $group: {
          _id: "$hazardClass",
          count: { $sum: 1 },
          compounds: { $push: "$compoundName" },
        },
      },
      {
        $project: {
          hazardClass: "$_id",
          _id: 0,
          count: 1,
          compounds: { $slice: ["$compounds", 5] }, // Limit to first 5 for each category
        },
      },
      {
        $sort: { count: -1 }, // Sort by count in descending order
      },
    ]);

    res.status(200).json({
      success: true,
      count: hazardStats.length,
      data: hazardStats,
    });
  } catch (error) {
    console.error("Error fetching chemicals by hazard class:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get chemicals expiring soon
exports.getExpiringChemicals = async (req, res) => {
  try {
    const { days = 90 } = req.query; // Default to 90 days
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + parseInt(days));

    const chemicals = await ChemicalCompound.find({
      expirationDate: {
        $exists: true,
        $ne: null,
        $gt: new Date(),
        $lt: expirationDate,
      },
    }).sort({ expirationDate: 1 });

    res.status(200).json({
      success: true,
      count: chemicals.length,
      data: chemicals,
    });
  } catch (error) {
    console.error("Error fetching expiring chemicals:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
=======
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
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11
  }
};

// HEAD request for all chemical compounds
exports.headChemicals = async (req, res) => {
  try {
    const count = await ChemicalCompound.countDocuments();
    res.set("X-Total-Count", count.toString());
    res.set("X-Resource-Type", "ChemicalCompounds");
    // Add cache control headers
    res.set("Cache-Control", "max-age=60"); // Cache for 60 seconds
    res.status(200).end();
  } catch (error) {
    console.error("Error handling HEAD for chemicals:", error);
    res.status(500).end(); // HEAD should not return a body on error
  }
};

// OPTIONS request for chemical compounds collection
exports.getChemicalOptions = (req, res) => {
  res.set("Allow", "GET, POST, HEAD, OPTIONS");
  res.status(200).end();
};

// HEAD request for single chemical compound
exports.headChemical = async (req, res) => {
  try {
    const chemical = await ChemicalCompound.findById(req.params.id).select(
      "updatedAt createdAt"
    );

    if (!chemical) {
      return res.status(404).end();
    }

    res.set("X-Resource-Type", "ChemicalCompound");
    if (chemical.updatedAt) {
      res.set("Last-Modified", chemical.updatedAt.toUTCString());
    } else if (chemical.createdAt) {
      res.set("Last-Modified", chemical.createdAt.toUTCString());
    }

    // Add ETag based on updatedAt or version field
    const etag = `"${chemical._id.toString()}-${new Date(
      chemical.updatedAt || chemical.createdAt
    ).getTime()}"`;
    res.set("ETag", etag);

    res.status(200).end();
  } catch (error) {
    console.error("Error handling HEAD for single chemical:", error);
    if (error.name === "CastError") {
      return res.status(400).end(); // Invalid ID format
    }
    res.status(500).end();
  }
};

// OPTIONS request for single chemical compound
exports.getChemicalIdOptions = (req, res) => {
  res.set("Allow", "GET, PUT, DELETE, PATCH, HEAD, OPTIONS");
  res.status(200).end();
};

// PATCH a chemical compound - partial update
exports.patchChemical = async (req, res) => {
  try {
    // Prevent overwriting the entire document with patch
    if (req.body._id) delete req.body._id; // Cannot update _id

    const chemical = await ChemicalCompound.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Use $set to apply partial updates
      {
        new: true, // Return the modified document
        runValidators: true, // Run model validation on updated fields
        context: "query", // Important for some validators
      }
    );

    if (!chemical) {
      return res.status(404).json({
        success: false,
        error: "Chemical compound not found",
      });
    }

    res.status(200).json({
      success: true,
      data: chemical,
    });
  } catch (error) {
    console.error("Error patching chemical:", error);
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else if (error.name === "CastError") {
      res.status(400).json({ success: false, error: "Invalid ID format" });
    } else {
      res.status(500).json({
        success: false,
        error: "Server error during chemical patch",
      });
    }
  }
};
