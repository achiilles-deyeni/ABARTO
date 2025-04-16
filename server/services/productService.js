const Product = require('../models/products');

// --- Product CRUD & Search Operations ---

/**
 * Retrieves a paginated and sorted list of products.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @returns {Promise<{products: Array, totalProducts: number}>}
 */
const getAllProducts = async ({ limit, skip, sortOptions }) => {
    const totalProducts = await Product.countDocuments();
    const products = await Product.find()
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    return { products, totalProducts };
};

/**
 * Finds a product by ID.
 * @param {string} id - The ID of the product.
 * @returns {Promise<object|null>} The product document or null if not found.
 */
const getProductById = async (id) => {
    return Product.findById(id);
};

/**
 * Creates a new product.
 * @param {object} productData - Data for the new product.
 * @returns {Promise<object>} The saved product document.
 */
const createProduct = async (productData) => {
    return Product.create(productData);
};

/**
 * Updates a product by ID (full replacement).
 * @param {string} id - The ID of the product to update.
 * @param {object} productData - The new data for the product.
 * @returns {Promise<object|null>} The updated product document or null if not found.
 */
const updateProduct = async (id, productData) => {
    return Product.findByIdAndUpdate(id, productData, { new: true, runValidators: true, overwrite: true });
};

/**
 * Partially updates a product by ID.
 * @param {string} id - The ID of the product to update.
 * @param {object} productData - The fields to update.
 * @returns {Promise<object|null>} The updated product document or null if not found.
 */
const patchProduct = async (id, productData) => {
    // Ensure _id is not part of the update payload if present
    if (productData._id) delete productData._id;
    return Product.findByIdAndUpdate(id, { $set: productData }, { new: true, runValidators: true, context: 'query' });
};

/**
 * Deletes a product by ID.
 * @param {string} id - The ID of the product to delete.
 * @returns {Promise<object|null>} The deleted product document or null if not found.
 */
const deleteProduct = async (id) => {
    return Product.findByIdAndDelete(id);
};

/**
 * Searches for products based on criteria with pagination and sorting.
 * Criteria can include name, category, price range, rating range.
 * @param {object} queryCriteria - MongoDB query object for filtering.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @returns {Promise<{products: Array, totalMatchingProducts: number}>}
 */
const searchProducts = async (queryCriteria, { limit, skip, sortOptions }) => {
    const totalMatchingProducts = await Product.countDocuments(queryCriteria);
    const products = await Product.find(queryCriteria)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    return { products, totalMatchingProducts };
};

// --- HEAD/OPTIONS related ---

/**
 * Gets the total count of products.
 * @param {object} queryCriteria - Optional filter criteria.
 * @returns {Promise<number>} Total count.
 */
const getProductsCount = async (queryCriteria = {}) => {
    return Product.countDocuments(queryCriteria);
}

/**
 * Gets minimal info for a single product (for HEAD request).
 * @param {string} id - Product ID.
 * @returns {Promise<object|null>} Product with minimal fields or null.
 */
const getProductMetadata = async (id) => {
    return Product.findById(id).select('updatedAt createdAt'); // Select relevant fields for HEAD
}


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    patchProduct,
    deleteProduct,
    searchProducts,
    getProductsCount,
    getProductMetadata,
    // Aggregation for products is likely handled in reportService or similar
}; 