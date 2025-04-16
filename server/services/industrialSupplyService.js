const IndustrialSupply = require('../models/industrialSupply');

// --- IndustrialSupply CRUD & Search Operations ---

/**
 * Retrieves a paginated and sorted list of industrial supplies.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @returns {Promise<{supplies: Array, totalSupplies: number}>}
 */
const getAllIndustrialSupplies = async ({ limit, skip, sortOptions }) => {
    const totalSupplies = await IndustrialSupply.countDocuments();
    const supplies = await IndustrialSupply.find()
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    return { supplies, totalSupplies };
};

/**
 * Finds an industrial supply by ID.
 * @param {string} id - The ID of the supply.
 * @returns {Promise<object|null>} The supply document or null if not found.
 */
const getIndustrialSupplyById = async (id) => {
    return IndustrialSupply.findById(id);
};

/**
 * Creates a new industrial supply.
 * @param {object} supplyData - Data for the new supply.
 * @returns {Promise<object>} The saved supply document.
 */
const createIndustrialSupply = async (supplyData) => {
    return IndustrialSupply.create(supplyData);
};

/**
 * Updates an industrial supply by ID (full replacement).
 * @param {string} id - The ID of the supply to update.
 * @param {object} supplyData - The new data for the supply.
 * @returns {Promise<object|null>} The updated supply document or null if not found.
 */
const updateIndustrialSupply = async (id, supplyData) => {
    return IndustrialSupply.findByIdAndUpdate(id, supplyData, { new: true, runValidators: true, overwrite: true });
};

/**
 * Partially updates an industrial supply by ID.
 * @param {string} id - The ID of the supply to update.
 * @param {object} supplyData - The fields to update.
 * @returns {Promise<object|null>} The updated supply document or null if not found.
 */
const patchIndustrialSupply = async (id, supplyData) => {
    if (supplyData._id) delete supplyData._id;
    return IndustrialSupply.findByIdAndUpdate(id, { $set: supplyData }, { new: true, runValidators: true, context: 'query' });
};

/**
 * Deletes an industrial supply by ID.
 * @param {string} id - The ID of the supply to delete.
 * @returns {Promise<object|null>} The deleted supply document or null if not found.
 */
const deleteIndustrialSupply = async (id) => {
    return IndustrialSupply.findByIdAndDelete(id);
};

/**
 * Searches for industrial supplies based on criteria with pagination and sorting.
 * @param {object} queryCriteria - MongoDB query object for filtering.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @returns {Promise<{supplies: Array, totalMatchingSupplies: number}>}
 */
const searchIndustrialSupplies = async (queryCriteria, { limit, skip, sortOptions }) => {
    const totalMatchingSupplies = await IndustrialSupply.countDocuments(queryCriteria);
    const supplies = await IndustrialSupply.find(queryCriteria)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    return { supplies, totalMatchingSupplies };
};

// --- HEAD/OPTIONS related ---

/**
 * Gets the total count of industrial supplies.
 * @param {object} queryCriteria - Optional filter criteria.
 * @returns {Promise<number>} Total count.
 */
const getIndustrialSuppliesCount = async (queryCriteria = {}) => {
    return IndustrialSupply.countDocuments(queryCriteria);
}

/**
 * Gets minimal info for a single industrial supply (for HEAD request).
 * @param {string} id - Supply ID.
 * @returns {Promise<object|null>} Supply with minimal fields or null.
 */
const getIndustrialSupplyMetadata = async (id) => {
    return IndustrialSupply.findById(id).select('updatedAt createdAt lastRestocked'); // Use timestamp fields
}


module.exports = {
    getAllIndustrialSupplies,
    getIndustrialSupplyById,
    createIndustrialSupply,
    updateIndustrialSupply,
    patchIndustrialSupply,
    deleteIndustrialSupply,
    searchIndustrialSupplies,
    getIndustrialSuppliesCount,
    getIndustrialSupplyMetadata,
}; 