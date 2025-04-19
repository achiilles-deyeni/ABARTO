const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const DEFAULT_SORT_FIELD = 'createdAt'; // Default field to sort by if none provided
const DEFAULT_SORT_ORDER = 'desc';    // Default order (descending)

/**
 * Extracts and processes pagination, sorting, and limiting parameters from request query.
 *
 * @param {object} query - The request query object (e.g., req.query).
 * @param {string} [defaultSortField=DEFAULT_SORT_FIELD] - The default field to sort by if not specified in query.
 * @param {string} [defaultSortOrder=DEFAULT_SORT_ORDER] - The default sort order ('asc' or 'desc') if not specified.
 * @returns {object} An object containing { page, limit, skip, sortOptions }.
 */
const getPaginationParams = (query, defaultSortField = DEFAULT_SORT_FIELD, defaultSortOrder = DEFAULT_SORT_ORDER) => {
  const page = parseInt(query.page, 10) || DEFAULT_PAGE;
  const limit = parseInt(query.limit, 10) || DEFAULT_LIMIT;
  const effectiveLimit = Math.min(limit, MAX_LIMIT); // Ensure limit doesn't exceed max
  const skip = (page - 1) * effectiveLimit;

  const sortField = query.sort || defaultSortField;
  const sortOrder = query.order || defaultSortOrder;
  const sortOptions = {};
  sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;

  return {
    page,
    limit: effectiveLimit,
    skip,
    sortOptions,
  };
};

module.exports = {
    getPaginationParams,
    MAX_LIMIT // Export MAX_LIMIT if needed elsewhere
}; 