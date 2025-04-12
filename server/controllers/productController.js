const Product = require('../models/products'); // Assuming the model is exported as 'products'

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    // Pagination, Sorting, Limiting
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort || 'createdAt'; // Default sort field
    const order = req.query.order || 'asc'; // Default order 'asc' or 'desc'
    const skip = (page - 1) * limit;

    // Validate limit
    const maxLimit = 100; // Set a max limit for safety
    const effectiveLimit = Math.min(limit, maxLimit);

    // Build sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    // Get total count for pagination metadata
    const totalProducts = await Product.countDocuments();

    // Execute query with pagination, sorting, limiting
    const products = await Product.find()
      .sort(sortOptions)
      .skip(skip)
      .limit(effectiveLimit);

    res.status(200).json({
      success: true,
      total: totalProducts,
      page: page,
      limit: effectiveLimit,
      totalPages: Math.ceil(totalProducts / effectiveLimit),
      count: products.length, // Count on the current page
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error fetching products: ' + error.message
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
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category, quantity, rating } = req.body;

    // Check if product already exists (using name as unique identifier example)
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(402).json({ // 402 Payment Required is sometimes used, or 409 Conflict
        success: false,
        message: "Product already exists!"
      });
    }

    const product = await Product.create({
        name,
        price,
        description,
        category,
        quantity,
        rating
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    // Differentiate between validation errors and server errors
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else {
        res.status(500).json({ success: false, error: 'Server error during product creation' });
    }
  }
};

// Update a product (PUT - replace)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the modified document
        runValidators: true, // Run model validation
        overwrite: true // Ensures it's a PUT (replace) operation
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
     if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
     } else {
        res.status(500).json({ success: false, error: 'Server error during product update' });
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
        error: 'Product not found'
      });
    }

    res.status(200).json({ // Or 204 No Content
      success: true,
      message: "Product deleted successfully",
      data: {} // Optionally return the deleted object or empty object
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice, page = 1, limit = 10, sort = 'createdAt', order = 'asc' } = req.query;
    let query = {};

    if (name) query.name = { $regex: name, $options: 'i' }; // Case-insensitive regex search
    
    // Handle single or multiple categories
    if (category) {
      const categories = category.split(',').map(cat => cat.trim());
      // If multiple categories, use $in with case-insensitive regex for each
      if (categories.length > 1) {
          query.category = { $in: categories.map(cat => new RegExp(`^${cat}$`, 'i')) }; // Exact match, case-insensitive
      } else if (categories.length === 1 && categories[0]) {
          // If only one category, use case-insensitive regex (allows partial match)
          query.category = { $regex: categories[0], $options: 'i' };
      }
    }

    // Add price range query if provided
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Pagination, Sorting, Limiting
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Validate limit
    const maxLimit = 100; // Set a max limit
    const effectiveLimit = Math.min(limitNum, maxLimit);

    // Build sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    // Get total count matching the search query
    const totalMatchingProducts = await Product.countDocuments(query);

    // Execute query with filtering, pagination, sorting, limiting
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(effectiveLimit);

    res.status(200).json({
      success: true,
      total: totalMatchingProducts,
      page: pageNum,
      limit: effectiveLimit,
      totalPages: Math.ceil(totalMatchingProducts / effectiveLimit),
      count: products.length, // Count on the current page
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error searching products: ' + error.message
    });
  }
};

// HEAD request for all products
exports.headProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.set('X-Total-Count', count.toString());
    res.set('X-Resource-Type', 'Products');
    // Potentially add Cache-Control, Last-Modified if relevant for the collection
    res.status(200).end();
  } catch (error) {
    res.status(500).end(); // HEAD should not return a body on error
  }
};

// OPTIONS request for products collection
exports.getProductOptions = (req, res) => { // No async needed
  res.set('Allow', 'GET, POST, HEAD, OPTIONS');
  res.status(200).end();
};

// HEAD request for single product
exports.headProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('updatedAt createdAt'); // Only fetch necessary fields

    if (!product) {
      return res.status(404).end();
    }

    res.set('X-Resource-Type', 'Product');
    if (product.updatedAt) {
        res.set('Last-Modified', product.updatedAt.toUTCString());
    } else if (product.createdAt) {
        res.set('Last-Modified', product.createdAt.toUTCString()); // Fallback to createdAt
    }
    // Add ETag if you have a versioning field or hash mechanism
    // res.set('ETag', 'some-unique-identifier');
    res.status(200).end();
  } catch (error) {
    // Handle potential CastError for invalid ID format separately if needed
    res.status(500).end();
  }
};

// OPTIONS request for single product
exports.getProductIdOptions = (req, res) => { // No async needed
  // Here we might check if the product ID actually exists before sending options,
  // but for simplicity, we just return the allowed methods for any valid ID format path.
  res.set('Allow', 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS');
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
            context: 'query' // Important for some validators
        }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, error: error.message });
    } else {
        res.status(500).json({ success: false, error: 'Server error during product patch' });
    }
  }
};

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
        const result = await Product.insertMany(req.body, options);
        
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