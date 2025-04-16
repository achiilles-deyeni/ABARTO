const ChemicalCompound = require('../models/chemicalCompound');

// --- ChemicalCompound CRUD & Search Operations ---

/**
 * Retrieves a paginated and sorted list of chemical compounds.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @returns {Promise<{compounds: Array, totalCompounds: number}>}
 */
const getAllChemicalCompounds = async ({ limit, skip, sortOptions }) => {
    const totalCompounds = await ChemicalCompound.countDocuments();
    const compounds = await ChemicalCompound.find()
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    return { compounds, totalCompounds };
};

/**
 * Finds a chemical compound by ID.
 * @param {string} id - The ID of the compound.
 * @returns {Promise<object|null>} The compound document or null if not found.
 */
const getChemicalCompoundById = async (id) => {
    return ChemicalCompound.findById(id);
};

/**
 * Creates a new chemical compound.
 * @param {object} compoundData - Data for the new compound.
 * @returns {Promise<object>} The saved compound document.
 */
const createChemicalCompound = async (compoundData) => {
    return ChemicalCompound.create(compoundData);
};

/**
 * Updates a chemical compound by ID (full replacement).
 * @param {string} id - The ID of the compound to update.
 * @param {object} compoundData - The new data for the compound.
 * @returns {Promise<object|null>} The updated compound document or null if not found.
 */
const updateChemicalCompound = async (id, compoundData) => {
    return ChemicalCompound.findByIdAndUpdate(id, compoundData, { new: true, runValidators: true, overwrite: true });
};

/**
 * Partially updates a chemical compound by ID.
 * @param {string} id - The ID of the compound to update.
 * @param {object} compoundData - The fields to update.
 * @returns {Promise<object|null>} The updated compound document or null if not found.
 */
const patchChemicalCompound = async (id, compoundData) => {
    if (compoundData._id) delete compoundData._id;
    return ChemicalCompound.findByIdAndUpdate(id, { $set: compoundData }, { new: true, runValidators: true, context: 'query' });
};

/**
 * Deletes a chemical compound by ID.
 * @param {string} id - The ID of the compound to delete.
 * @returns {Promise<object|null>} The deleted compound document or null if not found.
 */
const deleteChemicalCompound = async (id) => {
    return ChemicalCompound.findByIdAndDelete(id);
};

/**
 * Searches for chemical compounds based on criteria with pagination and sorting.
 * @param {object} queryCriteria - MongoDB query object for filtering.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @returns {Promise<{compounds: Array, totalMatchingCompounds: number}>}
 */
const searchChemicalCompounds = async (queryCriteria, { limit, skip, sortOptions }) => {
    const totalMatchingCompounds = await ChemicalCompound.countDocuments(queryCriteria);
    const compounds = await ChemicalCompound.find(queryCriteria)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    return { compounds, totalMatchingCompounds };
};

// --- HEAD/OPTIONS related ---

/**
 * Gets the total count of chemical compounds.
 * @param {object} queryCriteria - Optional filter criteria.
 * @returns {Promise<number>} Total count.
 */
const getChemicalCompoundsCount = async (queryCriteria = {}) => {
    return ChemicalCompound.countDocuments(queryCriteria);
}

/**
 * Gets minimal info for a single chemical compound (for HEAD request).
 * @param {string} id - Compound ID.
 * @returns {Promise<object|null>} Compound with minimal fields or null.
 */
const getChemicalCompoundMetadata = async (id) => {
    // No timestamps in schema, select a different relevant field if needed for HEAD
    return ChemicalCompound.findById(id).select('name molecularFormula'); // Example
}

module.exports = {
    getAllChemicalCompounds,
    getChemicalCompoundById,
    createChemicalCompound,
    updateChemicalCompound,
    patchChemicalCompound,
    deleteChemicalCompound,
    searchChemicalCompounds,
    getChemicalCompoundsCount,
    getChemicalCompoundMetadata,
}; 