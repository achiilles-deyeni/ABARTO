const Admin = require('../models/admin');
const { hashPassword, comparePassword } = require('../utils/security');

// --- Admin CRUD & Search Operations ---

/**
 * Retrieves a paginated and sorted list of admins.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @returns {Promise<{admins: Array, totalAdmins: number}>}
 */
const getAllAdmins = async ({ limit, skip, sortOptions }) => {
    const totalAdmins = await Admin.countDocuments();
    // Exclude password field from the result
    const admins = await Admin.find().select('-password')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    return { admins, totalAdmins };
};

/**
 * Finds an admin by ID.
 * @param {string} id - The ID of the admin.
 * @returns {Promise<object|null>} The admin document (without password) or null if not found.
 */
const getAdminById = async (id) => {
    // Exclude password field
    return Admin.findById(id).select('-password');
};

/**
 * Creates a new admin.
 * @param {object} adminData - Data for the new admin.
 * @returns {Promise<object>} The saved admin document (without password).
 */
const createAdmin = async (adminData) => {
    if (adminData.password) {
        adminData.password = await hashPassword(adminData.password);
    }
    const newAdmin = await Admin.create(adminData);
    // Manually exclude password if create doesn't honor select: false on return
    const adminObject = newAdmin.toObject();
    delete adminObject.password;
    return adminObject;
};

/**
 * Updates an admin by ID (full replacement).
 * Handles password hashing if password is included in the update data.
 * @param {string} id - The ID of the admin to update.
 * @param {object} adminData - The new data for the admin.
 * @returns {Promise<object|null>} The updated admin document (without password) or null if not found.
 */
const updateAdmin = async (id, adminData) => {
    if (adminData.password) {
        adminData.password = await hashPassword(adminData.password);
    }
    const updatedAdmin = await Admin.findByIdAndUpdate(id, adminData, {
        new: true,
        runValidators: true,
        overwrite: true
    }).select('-password');
    return updatedAdmin;
};

/**
 * Partially updates an admin by ID.
 * Handles password hashing if password is included in the update data.
 * @param {string} id - The ID of the admin to update.
 * @param {object} adminData - The fields to update.
 * @returns {Promise<object|null>} The updated admin document (without password) or null if not found.
 */
const patchAdmin = async (id, adminData) => {
     if (adminData.password) {
        adminData.password = await hashPassword(adminData.password);
    }
     // Ensure _id is not part of the update payload if present
    if (adminData._id) delete adminData._id;

    const updatedAdmin = await Admin.findByIdAndUpdate(id, { $set: adminData }, {
        new: true,
        runValidators: true,
        context: 'query'
    }).select('-password');
    return updatedAdmin;
};

/**
 * Deletes an admin by ID.
 * @param {string} id - The ID of the admin to delete.
 * @returns {Promise<object|null>} The deleted admin document or null if not found.
 */
const deleteAdmin = async (id) => {
    return Admin.findByIdAndDelete(id);
};

/**
 * Searches for admins based on criteria with pagination and sorting.
 * @param {object} queryCriteria - MongoDB query object for filtering.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @returns {Promise<{admins: Array, totalMatchingAdmins: number}>}
 */
const searchAdmins = async (queryCriteria, { limit, skip, sortOptions }) => {
    const totalMatchingAdmins = await Admin.countDocuments(queryCriteria);
    const admins = await Admin.find(queryCriteria).select('-password')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    return { admins, totalMatchingAdmins };
};

// --- HEAD/OPTIONS related ---

/**
 * Gets the total count of admins.
 * @param {object} queryCriteria - Optional filter criteria.
 * @returns {Promise<number>} Total count.
 */
const getAdminsCount = async (queryCriteria = {}) => {
    return Admin.countDocuments(queryCriteria);
}

/**
 * Gets minimal info for a single admin (for HEAD request).
 * @param {string} id - Admin ID.
 * @returns {Promise<object|null>} Admin with minimal fields or null.
 */
const getAdminMetadata = async (id) => {
    return Admin.findById(id).select('updatedAt dateEmployed');
}

module.exports = {
    getAllAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    patchAdmin,
    deleteAdmin,
    searchAdmins,
    getAdminsCount,
    getAdminMetadata,
    // Note: We don't expose password comparison logic here;
    // that belongs in an authentication-specific service (like securityService.authenticateUser)
}; 