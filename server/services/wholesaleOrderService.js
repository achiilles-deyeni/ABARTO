const WholesaleOrder = require('../models/wholesaleOrder');

// --- WholesaleOrder CRUD & Search Operations ---

/**
 * Retrieves a paginated and sorted list of wholesale orders.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @param {boolean} [populateProducts=false] - Whether to populate the referenced product details.
 * @returns {Promise<{orders: Array, totalOrders: number}>}
 */
const getAllWholesaleOrders = async ({ limit, skip, sortOptions }, populateProducts = false) => {
    const totalOrders = await WholesaleOrder.countDocuments();
    let query = WholesaleOrder.find();
    if (populateProducts) {
        query = query.populate('wholeSalerProducts', 'name price category'); // Populate specific fields
    }
    const orders = await query.sort(sortOptions).skip(skip).limit(limit);
    return { orders, totalOrders };
};

/**
 * Finds a wholesale order by ID.
 * @param {string} id - The ID of the order.
 * @param {boolean} [populateProducts=false] - Whether to populate product details.
 * @returns {Promise<object|null>} The order document or null if not found.
 */
const getWholesaleOrderById = async (id, populateProducts = false) => {
    let query = WholesaleOrder.findById(id);
    if (populateProducts) {
        query = query.populate('wholeSalerProducts', 'name price category');
    }
    return query;
};

/**
 * Creates a new wholesale order.
 * @param {object} orderData - Data for the new order.
 * @returns {Promise<object>} The saved order document.
 */
const createWholesaleOrder = async (orderData) => {
    return WholesaleOrder.create(orderData);
};

/**
 * Updates a wholesale order by ID (full replacement).
 * @param {string} id - The ID of the order to update.
 * @param {object} orderData - The new data for the order.
 * @returns {Promise<object|null>} The updated order document or null if not found.
 */
const updateWholesaleOrder = async (id, orderData) => {
    return WholesaleOrder.findByIdAndUpdate(id, orderData, { new: true, runValidators: true, overwrite: true });
};

/**
 * Partially updates a wholesale order by ID.
 * Can be used to add/remove products from the order.
 * @param {string} id - The ID of the order to update.
 * @param {object} orderData - The fields to update (e.g., { $addToSet: { wholeSalerProducts: productId } }).
 * @returns {Promise<object|null>} The updated order document or null if not found.
 */
const patchWholesaleOrder = async (id, orderData) => {
    // Note: $set might not be ideal for array modifications.
    // Consider using $addToSet, $pull, etc. directly in the update object passed from controller.
    if (orderData._id) delete orderData._id;
    // Example for general patch, but specific array ops might be needed
    const updateOperation = Object.keys(orderData).some(key => key.startsWith('$'))
        ? orderData // Assume it's an operation like $addToSet, $pull
        : { $set: orderData }; // Default to $set if no operators

    return WholesaleOrder.findByIdAndUpdate(id, updateOperation, { new: true, runValidators: true, context: 'query' });
};

/**
 * Deletes a wholesale order by ID.
 * @param {string} id - The ID of the order to delete.
 * @returns {Promise<object|null>} The deleted order document or null if not found.
 */
const deleteWholesaleOrder = async (id) => {
    return WholesaleOrder.findByIdAndDelete(id);
};

/**
 * Searches for wholesale orders based on criteria with pagination and sorting.
 * @param {object} queryCriteria - MongoDB query object for filtering.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @param {boolean} [populateProducts=false] - Whether to populate product details.
 * @returns {Promise<{orders: Array, totalMatchingOrders: number}>}
 */
const searchWholesaleOrders = async (queryCriteria, { limit, skip, sortOptions }, populateProducts = false) => {
    const totalMatchingOrders = await WholesaleOrder.countDocuments(queryCriteria);
    let query = WholesaleOrder.find(queryCriteria);
    if (populateProducts) {
        query = query.populate('wholeSalerProducts', 'name price category');
    }
    const orders = await query.sort(sortOptions).skip(skip).limit(limit);
    return { orders, totalMatchingOrders };
};

// --- HEAD/OPTIONS related ---

/**
 * Gets the total count of wholesale orders.
 * @param {object} queryCriteria - Optional filter criteria.
 * @returns {Promise<number>} Total count.
 */
const getWholesaleOrdersCount = async (queryCriteria = {}) => {
    return WholesaleOrder.countDocuments(queryCriteria);
}

/**
 * Gets minimal info for a single wholesale order (for HEAD request).
 * @param {string} id - Order ID.
 * @returns {Promise<object|null>} Order with minimal fields or null.
 */
const getWholesaleOrderMetadata = async (id) => {
    // Schema has no timestamps, select other relevant fields
    return WholesaleOrder.findById(id).select('wholeSalerName wholeSalerEmail'); // Example
}

module.exports = {
    getAllWholesaleOrders,
    getWholesaleOrderById,
    createWholesaleOrder,
    updateWholesaleOrder,
    patchWholesaleOrder,
    deleteWholesaleOrder,
    searchWholesaleOrders,
    getWholesaleOrdersCount,
    getWholesaleOrderMetadata,
}; 