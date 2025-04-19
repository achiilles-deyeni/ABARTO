/**
 * Formats errors from a MongoDB bulk write operation for clearer reporting.
 * @param {MongoBulkWriteError} error - The error object from a bulk write operation.
 * @returns {object} An object containing extracted error details.
 */
const formatBulkWriteErrors = (error) => {
    if (!error || error.name !== 'MongoBulkWriteError' || !error.writeErrors) {
        return {
            error: 'An unexpected error occurred during the bulk operation.',
            details: []
        };
    }

    const details = error.writeErrors.map(err => ({
        index: err.index,
        code: err.code,
        message: err.errmsg,
        // You could add more specific parsing based on common error codes (e.g., 11000 for duplicate key)
    }));

    return {
        error: `Bulk operation failed with ${details.length} error(s).`,
        details: details
    };
};

// Add other bulk operation helpers here as needed, for example:
// - Preparing data for bulk updates
// - Handling large datasets by chunking

module.exports = {
    formatBulkWriteErrors,
}; 