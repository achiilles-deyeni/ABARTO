const MachineryPart = require("../models/machines");

// Get all machinery parts with pagination, sorting, and filtering
exports.getAllMachinery = async (req, res) => {
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
    const machines = await MachineryPart.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    // Get total count for pagination metadata
    const total = await MachineryPart.countDocuments(query);

    res.status(200).json({
      success: true,
      count: machines.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      data: machines,
    });
  } catch (error) {
    console.error("Error fetching machinery:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching machinery",
    });
  }
};

// Get a single machinery part by ID
exports.getMachineryById = async (req, res) => {
  try {
    const machine = await MachineryPart.findById(req.params.id);
    if (!machine) {
      return res
        .status(404)
        .json({ success: false, error: "Machinery not found" });
    }
    res.status(200).json({ success: true, data: machine });
  } catch (error) {
    console.error("Error fetching machinery by ID:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, error: "Invalid ID format" });
    }
    res
      .status(500)
      .json({ success: false, error: "Server error fetching machinery" });
  }
};

// Create a new machinery part
exports.createMachinery = async (req, res) => {
  try {
    const { name, type, quantity, price, description } = req.body;

    // Basic validation example
    if (!name || !type || quantity == null || price == null) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, type, quantity, price",
      });
    }

    // Check if machine already exists (e.g., by name)
    const existingMachine = await MachineryPart.findOne({ name });
    if (existingMachine) {
      return res.status(409).json({
        success: false,
        message: "Machinery with this name already exists!",
      });
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
    console.error("Error creating machinery:", error);
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res
        .status(500)
        .json({ success: false, error: "Server error creating machinery" });
    }
  }
};

// Bulk create machinery parts
exports.bulkCreateMachinery = async (req, res) => {
  try {
    // Validate that the body is an array
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        error: "Request body should be an array of machinery parts",
      });
    }

    // Perform basic validation on each item
    for (const item of req.body) {
      if (
        !item.name ||
        !item.type ||
        item.quantity == null ||
        item.price == null
      ) {
        return res.status(400).json({
          success: false,
          error: `Missing required fields for item: ${JSON.stringify(item)}`,
        });
      }
    }

    // Use insertMany for bulk operation
    const result = await MachineryPart.insertMany(req.body, {
      ordered: false, // Continues inserting documents even if one fails
      rawResult: true, // Returns additional info about the operation
    });

    res.status(201).json({
      success: true,
      inserted: result.insertedCount,
      data: result.ops, // The inserted documents
    });
  } catch (error) {
    console.error("Error bulk creating machinery:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update a machinery part (PUT - replace)
exports.updateMachinery = async (req, res) => {
  try {
    const { name, type, quantity, price, description } = req.body;

    // Basic validation example for PUT
    if (!name || !type || quantity == null || price == null) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields for update: name, type, quantity, price",
      });
    }

    const machine = await MachineryPart.findByIdAndUpdate(
      req.params.id,
      { name, type, quantity, price, description }, // Full replacement
      { new: true, runValidators: true, overwrite: true }
    );

    if (!machine) {
      return res
        .status(404)
        .json({ success: false, error: "Machinery not found" });
    }
    res.status(200).json({ success: true, data: machine });
  } catch (error) {
    console.error("Error updating machinery (PUT):", error);
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else if (error.name === "CastError") {
      res.status(400).json({ success: false, error: "Invalid ID format" });
    } else {
      res
        .status(500)
        .json({ success: false, error: "Server error updating machinery" });
    }
  }
};

// Delete a machinery part
exports.deleteMachinery = async (req, res) => {
  try {
    const machine = await MachineryPart.findByIdAndDelete(req.params.id);
    if (!machine) {
      return res
        .status(404)
        .json({ success: false, error: "Machinery not found" });
    }
    res.status(200).json({
      success: true,
      message: "Machinery deleted successfully",
      data: {},
    });
  } catch (error) {
    console.error("Error deleting machinery:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, error: "Invalid ID format" });
    }
    res
      .status(500)
      .json({ success: false, error: "Server error deleting machinery" });
  }
};

// Bulk delete machinery parts
exports.bulkDeleteMachinery = async (req, res) => {
  try {
    // Check if we have an array of IDs
    if (!Array.isArray(req.body.ids)) {
      return res.status(400).json({
        success: false,
        error: "Request body should contain an array of IDs to delete",
      });
    }

    const result = await MachineryPart.deleteMany({
      _id: { $in: req.body.ids },
    });

    res.status(200).json({
      success: true,
      deleted: result.deletedCount,
      message: `${result.deletedCount} machinery parts deleted successfully`,
    });
  } catch (error) {
    console.error("Error bulk deleting machinery:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Advanced search machinery parts with complex queries
exports.searchMachinery = async (req, res) => {
  try {
    const {
      name,
      type,
      minQuantity,
      maxQuantity,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    // Build query conditions
    if (name) query.name = { $regex: name, $options: "i" };
    if (type) query.type = { $regex: type, $options: "i" };

    // Handle quantity range
    if (minQuantity !== undefined || maxQuantity !== undefined) {
      query.quantity = {};
      if (minQuantity !== undefined)
        query.quantity.$gte = parseInt(minQuantity);
      if (maxQuantity !== undefined)
        query.quantity.$lte = parseInt(maxQuantity);
    }

    // Handle price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) query.price.$lte = parseFloat(maxPrice);
    }

    // Handle pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Handle sorting
    const sort = {};
    sort[sortBy || "createdAt"] = sortOrder === "asc" ? 1 : -1;

    // Use cursor for efficient large result handling
    const cursor = MachineryPart.find(query).sort(sort).cursor();

    const machines = [];
    let count = 0;

    // Skip documents for pagination
    for (let i = 0; i < skip; i++) {
      const hasNext = await cursor.next();
      if (!hasNext) break;
    }

    // Fetch limited number of documents
    for (let i = 0; i < parseInt(limit); i++) {
      const machine = await cursor.next();
      if (!machine) break;
      machines.push(machine);
      count++;
    }

    // Get total count for pagination info
    const total = await MachineryPart.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      data: machines,
    });
  } catch (error) {
    console.error("Error searching machinery:", error);
    res.status(500).json({
      success: false,
      error: "Server error searching machinery",
    });
  }
};

// Aggregation endpoints

// Get machinery statistics
exports.getMachineryStats = async (req, res) => {
  try {
    const stats = await MachineryPart.aggregate([
      {
        $group: {
          _id: null,
          totalMachines: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
          totalQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {},
    });
  } catch (error) {
    console.error("Error getting machinery stats:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get machinery by type with count and average price
exports.getMachineryByType = async (req, res) => {
  try {
    const typeStats = await MachineryPart.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $sort: { count: -1 }, // Sort by count in descending order
      },
    ]);

    res.status(200).json({
      success: true,
      count: typeStats.length,
      data: typeStats,
    });
  } catch (error) {
    console.error("Error getting machinery by type:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get low stock machinery parts
exports.getLowStockMachinery = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;

    const lowStockMachines = await MachineryPart.aggregate([
      {
        $match: { quantity: { $lte: threshold, $gt: 0 } },
      },
      {
        $sort: { quantity: 1 },
      },
      {
        $project: {
          name: 1,
          type: 1,
          price: 1,
          quantity: 1,
          description: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: lowStockMachines.length,
      data: lowStockMachines,
    });
  } catch (error) {
    console.error("Error getting low stock machinery:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// HEAD request for all machinery
exports.headMachinery = async (req, res) => {
  try {
    const count = await MachineryPart.countDocuments();
    res.set("X-Total-Count", count.toString());
    res.set("X-Resource-Type", "Machinery");
    // Add cache control headers
    res.set("Cache-Control", "max-age=60"); // Cache for 60 seconds
    res.status(200).end();
  } catch (error) {
    console.error("Error handling HEAD for machinery:", error);
    res.status(500).end();
  }
};

// OPTIONS request for machinery collection
exports.getMachineryOptions = (req, res) => {
  res.set("Allow", "GET, POST, HEAD, OPTIONS");
  res.status(200).end();
};

// HEAD request for single machinery part
exports.headMachineryById = async (req, res) => {
  try {
    const machine = await MachineryPart.findById(req.params.id).select(
      "updatedAt createdAt"
    );
    if (!machine) {
      return res.status(404).end();
    }
    res.set("X-Resource-Type", "MachineryPart");
    const lastModified = machine.updatedAt || machine.createdAt;
    if (lastModified) {
      res.set("Last-Modified", lastModified.toUTCString());
    }

    // Add ETag based on updatedAt or version field
    const etag = `"${machine._id.toString()}-${new Date(
      lastModified
    ).getTime()}"`;
    res.set("ETag", etag);

    // Add cache control
    res.set("Cache-Control", "max-age=60"); // Cache for 60 seconds

    res.status(200).end();
  } catch (error) {
    console.error("Error handling HEAD for single machinery:", error);
    if (error.name === "CastError") {
      return res.status(400).end();
    }
    res.status(500).end();
  }
};

// OPTIONS request for single machinery part
exports.getMachineryIdOptions = (req, res) => {
  res.set("Allow", "GET, PUT, DELETE, PATCH, HEAD, OPTIONS");
  res.status(200).end();
};

// PATCH a machinery part - partial update
exports.patchMachinery = async (req, res) => {
  try {
    if (req.body._id) delete req.body._id;

    const machine = await MachineryPart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true, context: "query" }
    );

    if (!machine) {
      return res
        .status(404)
        .json({ success: false, error: "Machinery not found" });
    }
    res.status(200).json({ success: true, data: machine });
  } catch (error) {
    console.error("Error patching machinery:", error);
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else if (error.name === "CastError") {
      res.status(400).json({ success: false, error: "Invalid ID format" });
    } else {
      res
        .status(500)
        .json({ success: false, error: "Server error patching machinery" });
    }
  }
};
