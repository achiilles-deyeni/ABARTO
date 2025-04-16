const RawMaterial = require('../models/rawMaterial');

// --- RawMaterial CRUD & Search Operations ---

/**
 * Retrieves a paginated and sorted list of raw materials.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @returns {Promise<{rawMaterials: Array, totalRawMaterials: number}>}
 */
const getAllRawMaterials = async ({ limit, skip, sortOptions }) => {
    const totalRawMaterials = await RawMaterial.countDocuments();
    const rawMaterials = await RawMaterial.find()
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    return { rawMaterials, totalRawMaterials };
};

/**
 * Finds a raw material by ID.
 * @param {string} id - The ID of the raw material.
 * @returns {Promise<object|null>} The raw material document or null if not found.
 */
const getRawMaterialById = async (id) => {
    return RawMaterial.findById(id);
};

/**
 * Creates a new raw material.
 * @param {object} rawMaterialData - Data for the new raw material.
 * @returns {Promise<object>} The saved raw material document.
 */
const createRawMaterial = async (rawMaterialData) => {
    // Consider converting price to Number if it's consistently numeric
    return RawMaterial.create(rawMaterialData);
};

/**
 * Updates a raw material by ID (full replacement).
 * @param {string} id - The ID of the raw material to update.
 * @param {object} rawMaterialData - The new data for the raw material.
 * @returns {Promise<object|null>} The updated raw material document or null if not found.
 */
const updateRawMaterial = async (id, rawMaterialData) => {
    return RawMaterial.findByIdAndUpdate(id, rawMaterialData, { new: true, runValidators: true, overwrite: true });
};

/**
 * Partially updates a raw material by ID.
 * @param {string} id - The ID of the raw material to update.
 * @param {object} rawMaterialData - The fields to update.
 * @returns {Promise<object|null>} The updated raw material document or null if not found.
 */
const patchRawMaterial = async (id, rawMaterialData) => {
    if (rawMaterialData._id) delete rawMaterialData._id;
    return RawMaterial.findByIdAndUpdate(id, { $set: rawMaterialData }, { new: true, runValidators: true, context: 'query' });
};

/**
 * Deletes a raw material by ID.
 * @param {string} id - The ID of the raw material to delete.
 * @returns {Promise<object|null>} The deleted raw material document or null if not found.
 */
const deleteRawMaterial = async (id) => {
    return RawMaterial.findByIdAndDelete(id);
};

/**
 * Searches for raw materials based on criteria with pagination and sorting.
 * @param {object} queryCriteria - MongoDB query object for filtering.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @returns {Promise<{rawMaterials: Array, totalMatchingRawMaterials: number}>}
 */
const searchRawMaterials = async (queryCriteria, { limit, skip, sortOptions }) => {
    const totalMatchingRawMaterials = await RawMaterial.countDocuments(queryCriteria);
    const rawMaterials = await RawMaterial.find(queryCriteria)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    return { rawMaterials, totalMatchingRawMaterials };
};

// --- HEAD/OPTIONS related ---

/**
 * Gets the total count of raw materials.
 * @param {object} queryCriteria - Optional filter criteria.
 * @returns {Promise<number>} Total count.
 */
const getRawMaterialsCount = async (queryCriteria = {}) => {
    return RawMaterial.countDocuments(queryCriteria);
}

/**
 * Gets minimal info for a single raw material (for HEAD request).
 * @param {string} id - RawMaterial ID.
 * @returns {Promise<object|null>} RawMaterial with minimal fields or null.
 */
const getRawMaterialMetadata = async (id) => {
    // Adjust fields based on what's relevant for Last-Modified or ETag
    return RawMaterial.findById(id).select('dateProvided'); // Example
}

module.exports = {
    getAllRawMaterials,
    getRawMaterialById,
    createRawMaterial,
    updateRawMaterial,
    patchRawMaterial,
    deleteRawMaterial,
    searchRawMaterials,
    getRawMaterialsCount,
    getRawMaterialMetadata,
}; 