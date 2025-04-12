const Product = require('../models/products'); // Assuming the model is exported as 'products'

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
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
    const { name, category, minPrice, maxPrice } = req.query;
    let query = {};

    if (name) query.name = { $regex: name, $options: 'i' }; // Case-insensitive regex search
    if (category) query.category = { $regex: category, $options: 'i' };

    // Add price range query if provided
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const products = await Product.find(query);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
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