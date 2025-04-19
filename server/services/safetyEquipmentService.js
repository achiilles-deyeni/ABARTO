const SafetyEquipment = require('../models/safetyEquipment');

// --- SafetyEquipment CRUD & Search Operations ---

/**
 * Retrieves a paginated and sorted list of safety equipment.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @returns {Promise<{equipments: Array, totalEquipments: number}>}
 */
const getAllSafetyEquipment = async ({ limit, skip, sortOptions }) => {
    const totalEquipments = await SafetyEquipment.countDocuments();
    const equipments = await SafetyEquipment.find()
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    return { equipments, totalEquipments };
};

/**
 * Finds a safety equipment item by ID.
 * @param {string} id - The ID of the item.
 * @returns {Promise<object|null>} The item document or null if not found.
 */
const getSafetyEquipmentById = async (id) => {
    return SafetyEquipment.findById(id);
};

/**
 * Creates a new safety equipment item.
 * @param {object} equipmentData - Data for the new item.
 * @returns {Promise<object>} The saved item document.
 */
const createSafetyEquipment = async (equipmentData) => {
    return SafetyEquipment.create(equipmentData);
};

/**
 * Updates a safety equipment item by ID (full replacement).
 * @param {string} id - The ID of the item to update.
 * @param {object} equipmentData - The new data for the item.
 * @returns {Promise<object|null>} The updated item document or null if not found.
 */
const updateSafetyEquipment = async (id, equipmentData) => {
    return SafetyEquipment.findByIdAndUpdate(id, equipmentData, { new: true, runValidators: true, overwrite: true });
};

/**
 * Partially updates a safety equipment item by ID.
 * @param {string} id - The ID of the item to update.
 * @param {object} equipmentData - The fields to update.
 * @returns {Promise<object|null>} The updated item document or null if not found.
 */
const patchSafetyEquipment = async (id, equipmentData) => {
    if (equipmentData._id) delete equipmentData._id;
    return SafetyEquipment.findByIdAndUpdate(id, { $set: equipmentData }, { new: true, runValidators: true, context: 'query' });
};

/**
 * Deletes a safety equipment item by ID.
 * @param {string} id - The ID of the item to delete.
 * @returns {Promise<object|null>} The deleted item document or null if not found.
 */
const deleteSafetyEquipment = async (id) => {
    return SafetyEquipment.findByIdAndDelete(id);
};

/**
 * Searches for safety equipment based on criteria with pagination and sorting.
 * @param {object} queryCriteria - MongoDB query object for filtering.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @returns {Promise<{equipments: Array, totalMatchingEquipments: number}>}
 */
const searchSafetyEquipment = async (queryCriteria, { limit, skip, sortOptions }) => {
    const totalMatchingEquipments = await SafetyEquipment.countDocuments(queryCriteria);
    const equipments = await SafetyEquipment.find(queryCriteria)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    return { equipments, totalMatchingEquipments };
};

// --- HEAD/OPTIONS related ---

/**
 * Gets the total count of safety equipment items.
 * @param {object} queryCriteria - Optional filter criteria.
 * @returns {Promise<number>} Total count.
 */
const getSafetyEquipmentCount = async (queryCriteria = {}) => {
    return SafetyEquipment.countDocuments(queryCriteria);
}

/**
 * Gets minimal info for a single safety equipment item (for HEAD request).
 * @param {string} id - Item ID.
 * @returns {Promise<object|null>} Item with minimal fields or null.
 */
const getSafetyEquipmentMetadata = async (id) => {
    // Adjust fields based on schema and needs for HEAD
    return SafetyEquipment.findById(id).select('EquipmentName EquipmentDateProvided'); // Example
}

module.exports = {
    getAllSafetyEquipment,
    getSafetyEquipmentById,
    createSafetyEquipment,
    updateSafetyEquipment,
    patchSafetyEquipment,
    deleteSafetyEquipment,
    searchSafetyEquipment,
    getSafetyEquipmentCount,
    getSafetyEquipmentMetadata,
}; 