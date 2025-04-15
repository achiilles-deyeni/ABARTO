const Employee = require('../models/employee');

// --- Employee CRUD & Search Operations ---

/**
 * Retrieves a paginated and sorted list of employees.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @returns {Promise<{employees: Array, totalEmployees: number}>}
 */
const getAllEmployees = async ({ limit, skip, sortOptions }) => {
    const totalEmployees = await Employee.countDocuments();
    const employees = await Employee.find()
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    return { employees, totalEmployees };
};

/**
 * Finds an employee by ID.
 * @param {string} id - The ID of the employee.
 * @returns {Promise<object|null>} The employee document or null if not found.
 */
const getEmployeeById = async (id) => {
    return Employee.findById(id);
};

/**
 * Creates a new employee.
 * @param {object} employeeData - Data for the new employee.
 * @returns {Promise<object>} The saved employee document.
 */
const createEmployee = async (employeeData) => {
    return Employee.create(employeeData);
};

/**
 * Updates an employee by ID (full replacement using findByIdAndUpdate).
 * @param {string} id - The ID of the employee to update.
 * @param {object} employeeData - The new data for the employee.
 * @returns {Promise<object|null>} The updated employee document or null if not found.
 */
const updateEmployee = async (id, employeeData) => {
    return Employee.findByIdAndUpdate(id, employeeData, { new: true, runValidators: true });
};

/**
 * Partially updates an employee by ID.
 * @param {string} id - The ID of the employee to update.
 * @param {object} employeeData - The fields to update.
 * @returns {Promise<object|null>} The updated employee document or null if not found.
 */
const patchEmployee = async (id, employeeData) => {
    // findById is needed to properly merge nested objects like emergencyContact
    const employee = await Employee.findById(id);
    if (!employee) return null;

    // Update fields, handling nested emergencyContact
    Object.keys(employeeData).forEach(key => {
        if (key === 'emergencyContact' && typeof employeeData.emergencyContact === 'object' && employee.emergencyContact) {
            // Merge existing and new emergency contact data
            employee.emergencyContact = {
                ...employee.emergencyContact.toObject(), // Convert existing subdoc to plain object
                ...employeeData.emergencyContact
            };
        } else if (key !== '_id') { // Don't attempt to update _id
            employee[key] = employeeData[key];
        }
    });

    // Mark modified paths if necessary for nested objects (Mongoose might not detect changes automatically)
    if (employeeData.emergencyContact) {
        employee.markModified('emergencyContact');
    }

    // Save the updated employee
    return employee.save(); // runValidators is true by default on save()
};

/**
 * Deletes an employee by ID.
 * @param {string} id - The ID of the employee to delete.
 * @returns {Promise<object|null>} The deleted employee document or null if not found.
 */
const deleteEmployee = async (id) => {
    return Employee.findByIdAndDelete(id);
};

/**
 * Searches for employees based on criteria with pagination and sorting.
 * @param {object} queryCriteria - MongoDB query object for filtering.
 * @param {object} paginationParams - Object containing { limit, skip, sortOptions }.
 * @returns {Promise<{employees: Array, totalMatchingEmployees: number}>}
 */
const searchEmployees = async (queryCriteria, { limit, skip, sortOptions }) => {
    const totalMatchingEmployees = await Employee.countDocuments(queryCriteria);
    const employees = await Employee.find(queryCriteria)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    return { employees, totalMatchingEmployees };
};

// --- Bulk Operations ---
/**
 * Inserts multiple employee documents.
 * @param {Array<object>} employeesData - An array of employee objects.
 * @returns {Promise<object>} Result of the insertMany operation.
 */
const bulkCreateEmployees = async (employeesData) => {
    const options = { ordered: false, runValidators: true }; // Allow continuation on error, run validators
    return Employee.insertMany(employeesData, options);
    // Note: Error handling for bulk operations (like duplicate keys) is complex
    // and might be better handled in the controller or a dedicated bulk operation utility
    // depending on the desired level of detail in the response.
};


// --- HEAD/OPTIONS related --- 

/**
 * Gets the total count of employees.
 * @param {object} queryCriteria - Optional filter criteria.
 * @returns {Promise<number>} Total count.
 */
const getEmployeesCount = async (queryCriteria = {}) => {
    return Employee.countDocuments(queryCriteria);
}

/**
 * Gets minimal info for a single employee (for HEAD request).
 * @param {string} id - Employee ID.
 * @returns {Promise<object|null>} Employee with minimal fields or null.
 */
const getEmployeeMetadata = async (id) => {
    // Select fields relevant for HEAD (like updatedAt, createdAt/dateEmployed)
    return Employee.findById(id).select('updatedAt dateEmployed');
}


module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    patchEmployee,
    deleteEmployee,
    searchEmployees,
    bulkCreateEmployees,
    getEmployeesCount,
    getEmployeeMetadata,
}; 