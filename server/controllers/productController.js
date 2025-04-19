<<<<<<< HEAD
const Product = require("../models/products");

// Get all products with pagination, sorting and filtering
exports.getAllProducts = async (req, res) => {
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
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    // Get total count for pagination metadata
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
=======
const productService = require('../services/productService');
const { getPaginationParams } = require('../utils/pagination');
const asyncHandler = require('../utils/asyncHandler');

// Get all products
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const paginationParams = getPaginationParams(req.query, 'name', 'asc'); // Default sort for products
  const { products, totalProducts } = await productService.getAllProducts(paginationParams);

  res.status(200).json({
    success: true,
    total: totalProducts,
    page: paginationParams.page,
    limit: paginationParams.limit,
    totalPages: Math.ceil(totalProducts / paginationParams.limit),
    count: products.length,
    data: products
  });
});

// Get a single product by ID
exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await productService.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11
  }
  res.status(200).json({ success: true, data: product });
});

// Create a new product
exports.createProduct = asyncHandler(async (req, res, next) => {
  // Add validation here or via middleware later
  const product = await productService.createProduct(req.body);
  res.status(201).json({ success: true, data: product });
});

<<<<<<< HEAD
    // Check if product already exists (using name as unique identifier example)
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(409).json({
        // Changed to 409 Conflict which is more appropriate
        success: false,
        message: "Product already exists!",
      });
    }

    const product = await Product.create({
      name,
      price,
      description,
      category,
      quantity,
      rating,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    // Differentiate between validation errors and server errors
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res
        .status(500)
        .json({
          success: false,
          error: "Server error during product creation",
        });
    }
  }
};

// Bulk create products
exports.bulkCreateProducts = async (req, res) => {
  try {
    // Validate that the body is an array
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        error: "Request body should be an array of products",
      });
    }

    // Use insertMany for bulk operation
    const products = await Product.insertMany(req.body, {
      ordered: false, // Continues inserting documents even if one fails
      rawResult: true, // Returns additional info about the operation
    });

    res.status(201).json({
      success: true,
      inserted: products.insertedCount,
      data: products.ops, // The inserted documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update a product (PUT - replace)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the modified document
      runValidators: true, // Run model validation
      overwrite: true, // Ensures it's a PUT (replace) operation
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res
        .status(500)
        .json({ success: false, error: "Server error during product update" });
    }
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: {}, // Optionally return the deleted object or empty object
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
=======
// Update a product (PUT - full update)
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.status(200).json({ success: true, data: product });
});

// Delete a product
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.deleteProduct(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11
  }
  res.status(200).json({ success: true, data: {} });
});

<<<<<<< HEAD
// Bulk delete products
exports.bulkDeleteProducts = async (req, res) => {
  try {
    // Check if we have an array of IDs
    if (!Array.isArray(req.body.ids)) {
      return res.status(400).json({
        success: false,
        error: "Request body should contain an array of IDs to delete",
      });
    }

    const result = await Product.deleteMany({ _id: { $in: req.body.ids } });

    res.status(200).json({
      success: true,
      deleted: result.deletedCount,
      message: `${result.deletedCount} products deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Advanced search products with complex queries
exports.searchProducts = async (req, res) => {
  try {
    const {
      name,
      category,
      minPrice,
      maxPrice,
      rating,
      inStock,
      query = {},
    } = req.query;

    // Build the query object for MongoDB
    if (name) query.name = { $regex: name, $options: "i" }; // Case-insensitive regex search
    if (category) query.category = { $regex: category, $options: "i" };

    // Add price range query if provided
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Add rating filter if provided
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // Add stock filter if provided
    if (inStock === "true") {
      query.quantity = { $gt: 0 };
    } else if (inStock === "false") {
      query.quantity = { $lte: 0 };
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
    const cursor = Product.find(query).sort(sort).cursor();

    const products = [];
    let count = 0;

    // Skip documents for pagination
    for (let i = 0; i < skip; i++) {
      const hasNext = await cursor.next();
      if (!hasNext) break;
    }

    // Fetch limited number of documents
    for (let i = 0; i < limit; i++) {
      const product = await cursor.next();
      if (!product) break;
      products.push(product);
      count++;
    }

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Aggregation endpoints

// Get product statistics
exports.getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
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

// Get products by category with count and average price
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
        },
      },
      {
        $sort: { count: -1 }, // Sort by count in descending order
      },
    ]);

    res.status(200).json({
      success: true,
      count: categoryStats.length,
      data: categoryStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get top N products by rating
exports.getTopRatedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const topRatedProducts = await Product.aggregate([
      {
        $sort: { rating: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          name: 1,
          price: 1,
          rating: 1,
          category: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: topRatedProducts.length,
      data: topRatedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get low stock products
exports.getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 10;

    const lowStockProducts = await Product.aggregate([
      {
        $match: { quantity: { $lte: threshold, $gt: 0 } },
      },
      {
        $sort: { quantity: 1 },
      },
      {
        $project: {
          name: 1,
          price: 1,
          quantity: 1,
          category: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: lowStockProducts.length,
      data: lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
=======
// Search products
exports.searchProducts = asyncHandler(async (req, res, next) => {
  // Define searchable fields for products
  const { name, category, minPrice, maxPrice, minRating, maxRating, ...paginationQuery } = req.query;
  const paginationParams = getPaginationParams(paginationQuery, 'name', 'asc');

  // Build search criteria
  let queryCriteria = {};
  if (name) queryCriteria.name = { $regex: name, $options: 'i' };
  if (category) queryCriteria.category = { $regex: category, $options: 'i' };
  // Price range
  if (minPrice || maxPrice) {
      queryCriteria.price = {};
      if (minPrice) queryCriteria.price.$gte = parseFloat(minPrice);
      if (maxPrice) queryCriteria.price.$lte = parseFloat(maxPrice);
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11
  }
  // Rating range
  if (minRating || maxRating) {
      queryCriteria.rating = {};
      if (minRating) queryCriteria.rating.$gte = parseFloat(minRating);
      if (maxRating) queryCriteria.rating.$lte = parseFloat(maxRating);
  }
  // Add description search if needed (requires text index on model)
  // if (req.query.description) queryCriteria.$text = { $search: req.query.description };

  const { products, totalMatchingProducts } = await productService.searchProducts(queryCriteria, paginationParams);

  res.status(200).json({
    success: true,
    total: totalMatchingProducts,
    page: paginationParams.page,
    limit: paginationParams.limit,
    totalPages: Math.ceil(totalMatchingProducts / paginationParams.limit),
    count: products.length,
    data: products
  });
});

// HEAD request for all products
<<<<<<< HEAD
exports.headProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.set("X-Total-Count", count.toString());
    res.set("X-Resource-Type", "Products");
    // Add cache control headers
    res.set("Cache-Control", "max-age=60"); // Cache for 60 seconds
    res.status(200).end();
  } catch (error) {
    res.status(500).end(); // HEAD should not return a body on error
  }
};

// OPTIONS request for products collection
exports.getProductOptions = (req, res) => {
  res.set("Allow", "GET, POST, HEAD, OPTIONS");
=======
exports.headProducts = asyncHandler(async (req, res, next) => {
  const count = await productService.getProductsCount();
  res.set('X-Total-Count', count.toString());
  res.set('X-Resource-Type', 'Products');
  res.status(200).end();
});

// OPTIONS request for products collection
exports.getProductOptions = (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS, PATCH');
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11
  res.status(200).end();
};

// HEAD request for single product
<<<<<<< HEAD
exports.headProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select(
      "updatedAt createdAt"
    );

    if (!product) {
      return res.status(404).end();
    }

    res.set("X-Resource-Type", "Product");
    if (product.updatedAt) {
      res.set("Last-Modified", product.updatedAt.toUTCString());
    } else if (product.createdAt) {
      res.set("Last-Modified", product.createdAt.toUTCString());
    }

    // Add ETag based on updatedAt or version field
    const etag = `"${product._id.toString()}-${new Date(
      product.updatedAt || product.createdAt
    ).getTime()}"`;
    res.set("ETag", etag);

    res.status(200).end();
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).end(); // Invalid ID format
    }
    res.status(500).end();
=======
exports.headProduct = asyncHandler(async (req, res, next) => {
  const productMeta = await productService.getProductMetadata(req.params.id);
  if (!productMeta) {
    return res.status(404).end();
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11
  }
  res.set('X-Resource-Type', 'Product');
  const lastModified = productMeta.updatedAt || productMeta.createdAt;
  if(lastModified) {
      res.set('Last-Modified', new Date(lastModified).toUTCString());
  }
  res.status(200).end();
});

// OPTIONS request for single product
exports.getProductIdOptions = (req, res) => {
<<<<<<< HEAD
  res.set("Allow", "GET, PUT, DELETE, PATCH, HEAD, OPTIONS");
  res.status(200).end();
};

// PATCH a product - partial update
exports.patchProduct = async (req, res) => {
  try {
    // Prevent overwriting the entire document with patch
    if (req.body._id) delete req.body._id; // Cannot update _id

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Use $set to apply partial updates
      {
        new: true, // Return the modified document
        runValidators: true, // Run model validation on updated fields
        context: "query", // Important for some validators
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res
        .status(500)
        .json({ success: false, error: "Server error during product patch" });
    }
  }
};
=======
  res.set('Allow', 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS');
  res.status(200).end();
};

// PATCH a product (partial update)
exports.patchProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.patchProduct(req.params.id, req.body);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.status(200).json({ success: true, data: product });
});

// BULK OPERATIONS
exports.bulkCreateProducts = async (req, res) => {
    // Expect req.body to be an array of product objects
    if (!Array.isArray(req.body)) {
        return res.status(400).json({ success: false, error: 'Request body must be an array of products.' });
    }
    if (req.body.length === 0) {
        return res.status(400).json({ success: false, error: 'Request body array cannot be empty.' });
    }

    try {
        // Options: { ordered: false } allows continuing even if some inserts fail
        // { ordered: true } stops on the first error (default)
        const options = { ordered: false, runValidators: true }; 
        const result = await productService.bulkCreateProducts(req.body, options);
        
        res.status(201).json({ 
            success: true, 
            message: `Successfully inserted ${result.length} products.`, 
            insertedCount: result.length,
            // data: result // Optionally return the inserted documents
        });

    } catch (error) {
        console.error("Bulk insert error:", error);
        // Check if it's a bulk write error with validation issues
        if (error.name === 'MongoBulkWriteError' && error.writeErrors) {
            const validationErrors = error.writeErrors.map(err => ({
                index: err.index,
                code: err.code,
                message: err.errmsg
            }));
            return res.status(400).json({ 
                success: false, 
                error: 'Bulk operation failed due to validation errors.', 
                validationErrors 
            });
        } else if (error.name === 'ValidationError') {
            // This might catch validation errors if runValidators triggers before insertMany 
            // (less likely with insertMany directly, but good to have)
             res.status(400).json({ success: false, error: error.message });
        }
        else {
             res.status(500).json({ success: false, error: 'Server error during bulk product creation.' });
        }
    }
}; 
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11
