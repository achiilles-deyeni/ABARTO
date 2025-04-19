const MachineryPart = require('../models/machineryPart');

// --- MachineryPart CRUD & Search Operations ---

/**
 * Retrieves a paginated and sorted list of machinery parts.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @param {boolean} [populateMachine=false] - Whether to populate the referenced machine details.
 * @returns {Promise<{parts: Array, totalParts: number}>}
 */
const getAllMachineryParts = async ({ limit, skip, sortOptions }, populateMachine = false) => {
    const totalParts = await MachineryPart.countDocuments();
    let query = MachineryPart.find();

    if (populateMachine) {
        query = query.populate('machine', 'name manufacturer model'); // Populate specific fields from Machine model
    }

    const parts = await query.sort(sortOptions).skip(skip).limit(limit);
    return { parts, totalParts };
};

/**
 * Finds a machinery part by ID.
 * @param {string} id - The ID of the part.
 * @param {boolean} [populateMachine=false] - Whether to populate the referenced machine details.
 * @returns {Promise<object|null>} The part document or null if not found.
 */
const getMachineryPartById = async (id, populateMachine = false) => {
    let query = MachineryPart.findById(id);
    if (populateMachine) {
        query = query.populate('machine', 'name manufacturer model'); // Populate specific fields
    }
    return query;
};

/**
 * Creates a new machinery part.
 * @param {object} partData - Data for the new part.
 * @returns {Promise<object>} The saved part document.
 */
const createMachineryPart = async (partData) => {
    return MachineryPart.create(partData);
};

/**
 * Updates a machinery part by ID (full replacement).
 * @param {string} id - The ID of the part to update.
 * @param {object} partData - The new data for the part.
 * @returns {Promise<object|null>} The updated part document or null if not found.
 */
const updateMachineryPart = async (id, partData) => {
    return MachineryPart.findByIdAndUpdate(id, partData, { new: true, runValidators: true, overwrite: true });
};

/**
 * Partially updates a machinery part by ID.
 * @param {string} id - The ID of the part to update.
 * @param {object} partData - The fields to update.
 * @returns {Promise<object|null>} The updated part document or null if not found.
 */
const patchMachineryPart = async (id, partData) => {
    if (partData._id) delete partData._id;
    return MachineryPart.findByIdAndUpdate(id, { $set: partData }, { new: true, runValidators: true, context: 'query' });
};

/**
 * Deletes a machinery part by ID.
 * @param {string} id - The ID of the part to delete.
 * @returns {Promise<object|null>} The deleted part document or null if not found.
 */
const deleteMachineryPart = async (id) => {
    return MachineryPart.findByIdAndDelete(id);
};

/**
 * Searches for machinery parts based on criteria with pagination and sorting.
 * @param {object} queryCriteria - MongoDB query object for filtering.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @param {boolean} [populateMachine=false] - Whether to populate the referenced machine details.
 * @returns {Promise<{parts: Array, totalMatchingParts: number}>}
 */
const searchMachineryParts = async (queryCriteria, { limit, skip, sortOptions }, populateMachine = false) => {
    const totalMatchingParts = await MachineryPart.countDocuments(queryCriteria);
    let query = MachineryPart.find(queryCriteria);

    if (populateMachine) {
        query = query.populate('machine', 'name manufacturer model');
    }

    const parts = await query.sort(sortOptions).skip(skip).limit(limit);
    return { parts, totalMatchingParts };
};

// --- HEAD/OPTIONS related ---

/**
 * Gets the total count of machinery parts.
 * @param {object} queryCriteria - Optional filter criteria.
 * @returns {Promise<number>} Total count.
 */
const getMachineryPartsCount = async (queryCriteria = {}) => {
    return MachineryPart.countDocuments(queryCriteria);
}

/**
 * Gets minimal info for a single machinery part (for HEAD request).
 * @param {string} id - Part ID.
 * @returns {Promise<object|null>} Part with minimal fields or null.
 */
const getMachineryPartMetadata = async (id) => {
    // Schema doesn't have timestamps, select relevant fields
    return MachineryPart.findById(id).select('name type machine'); // Example
}


module.exports = {
    getAllMachineryParts,
    getMachineryPartById,
    createMachineryPart,
    updateMachineryPart,
    patchMachineryPart,
    deleteMachineryPart,
    searchMachineryParts,
    getMachineryPartsCount,
    getMachineryPartMetadata,
}; 