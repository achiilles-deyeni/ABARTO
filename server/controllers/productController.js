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
  }
  res.status(200).json({ success: true, data: product });
});

// Create a new product
exports.createProduct = asyncHandler(async (req, res, next) => {
  // Add validation here or via middleware later
  const product = await productService.createProduct(req.body);
  res.status(201).json({ success: true, data: product });
});

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
  }
  res.status(200).json({ success: true, data: {} });
});

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
exports.headProducts = asyncHandler(async (req, res, next) => {
  const count = await productService.getProductsCount();
  res.set('X-Total-Count', count.toString());
  res.set('X-Resource-Type', 'Products');
  res.status(200).end();
});

// OPTIONS request for products collection
exports.getProductOptions = (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS, PATCH');
  res.status(200).end();
};

// HEAD request for single product
exports.headProduct = asyncHandler(async (req, res, next) => {
  const productMeta = await productService.getProductMetadata(req.params.id);
  if (!productMeta) {
    return res.status(404).end();
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