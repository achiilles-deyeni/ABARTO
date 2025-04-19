const Report = require('../models/report');
const Product = require('../models/products');

// --- Report CRUD & Search Operations ---

/**
 * Retrieves a paginated and sorted list of reports.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @returns {Promise<{reports: Array, totalReports: number}>}
 */
const getAllReports = async ({ limit, skip, sortOptions }) => {
    const totalReports = await Report.countDocuments();
    const reports = await Report.find()
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    return { reports, totalReports };
};

/**
 * Finds a report by its ID.
 * @param {string} id - The ID of the report.
 * @returns {Promise<object|null>} The report document or null if not found.
 */
const getReportById = async (id) => {
    return Report.findById(id);
};

/**
 * Creates a new report record.
 * @param {object} reportData - Data for the new report (e.g., { reportName, type, parameters }).
 * @returns {Promise<object>} The saved report document.
 */
const createReport = async (reportData) => {
    const newReport = new Report({
        ...reportData,
        generatedAt: Date.now(),
        // filePath: 'path/to/generated/report.pdf' // Example logic if needed
    });
    return newReport.save();
};

/**
 * Updates a report by ID (full replacement).
 * @param {string} id - The ID of the report to update.
 * @param {object} reportData - The new data for the report.
 * @returns {Promise<object|null>} The updated report document or null if not found.
 */
const updateReport = async (id, reportData) => {
    return Report.findByIdAndUpdate(
        id,
        reportData, // Assumes generatedAt is included if needed
        { new: true, runValidators: true, overwrite: true }
    );
};

/**
 * Partially updates a report by ID.
 * @param {string} id - The ID of the report to update.
 * @param {object} reportData - The fields to update.
 * @returns {Promise<object|null>} The updated report document or null if not found.
 */
const patchReport = async (id, reportData) => {
    // Ensure _id is not part of the update payload if present
    if (reportData._id) delete reportData._id;
    return Report.findByIdAndUpdate(
        id,
        { $set: reportData },
        { new: true, runValidators: true, context: 'query' }
    );
};

/**
 * Deletes a report by ID.
 * @param {string} id - The ID of the report to delete.
 * @returns {Promise<object|null>} The deleted report document or null if not found.
 */
const deleteReport = async (id) => {
    // Add logic here if associated files need deletion too
    return Report.findByIdAndDelete(id);
};

/**
 * Searches for reports based on criteria with pagination and sorting.
 * @param {object} queryCriteria - MongoDB query object for filtering.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @returns {Promise<{reports: Array, totalMatchingReports: number}>}
 */
const searchReports = async (queryCriteria, { limit, skip, sortOptions }) => {
    const totalMatchingReports = await Report.countDocuments(queryCriteria);
    const reports = await Report.find(queryCriteria)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    return { reports, totalMatchingReports };
};

// --- Aggregation Operations ---

/**
 * Calculates statistics for product prices.
 * @returns {Promise<object>} Aggregated statistics.
 */
const getProductPriceStats = async () => {
    const stats = await Product.aggregate([
        {
            $group: {
                _id: null, // Group all products together
                totalProducts: { $sum: 1 },
                averagePrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                // Example: Group by category instead (uncomment if needed)
                // _id: '$category',
                // totalProducts: { $sum: 1 },
                // averagePrice: { $avg: '$price' },
            }
        }
        // Add more stages if needed (e.g., $match, $sort)
    ]);

    // Return default values if no products are found
    if (!stats || stats.length === 0) {
        return {
            totalProducts: 0,
            averagePrice: 0,
            minPrice: 0,
            maxPrice: 0
        };
    }

    // The result is an array, return the first element
    return stats[0];
};

// --- HEAD/OPTIONS related --- (These don't typically go in a service layer as they interact directly with response headers)
/**
 * Gets the total count of reports (for HEAD request).
 * @param {object} queryCriteria - Optional filter criteria.
 * @returns {Promise<number>} Total count.
 */
const getReportsCount = async (queryCriteria = {}) => {
    return Report.countDocuments(queryCriteria);
}

/**
 * Gets minimal info for a single report (for HEAD request).
 * @param {string} id - Report ID.
 * @returns {Promise<object|null>} Report with minimal fields or null.
 */
const getReportMetadata = async (id) => {
    return Report.findById(id).select('generatedAt updatedAt createdAt');
}


module.exports = {
    getAllReports,
    getReportById,
    createReport,
    updateReport,
    patchReport,
    deleteReport,
    searchReports,
    getProductPriceStats,
    getReportsCount,      // Added for HEAD
    getReportMetadata   // Added for HEAD
};
