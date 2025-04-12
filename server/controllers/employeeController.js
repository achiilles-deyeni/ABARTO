const Employee = require('../models/employee');

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    // Pagination, Sorting, Limiting
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort || 'lastName'; // Default sort by last name
    const order = req.query.order || 'asc'; // Default order
    const skip = (page - 1) * limit;

    // Validate limit
    const maxLimit = 100; 
    const effectiveLimit = Math.min(limit, maxLimit);

    // Build sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    // Get total count
    const totalEmployees = await Employee.countDocuments();

    // Execute query
    const employees = await Employee.find()
      .sort(sortOptions)
      .skip(skip)
      .limit(effectiveLimit);

    res.status(200).json({
      success: true,
      total: totalEmployees,
      page: page,
      limit: effectiveLimit,
      totalPages: Math.ceil(totalEmployees / effectiveLimit),
      count: employees.length, // Count on the current page
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error fetching employees: ' + error.message
    });
  }
};

// Get a single employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    
    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update an employee
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Search employees
exports.searchEmployees = async (req, res) => {
  try {
    const { firstName, lastName, department, position, page = 1, limit = 10, sort = 'lastName', order = 'asc' } = req.query;
    let query = {};
    
    if (firstName) query.firstName = { $regex: firstName, $options: 'i' };
    if (lastName) query.lastName = { $regex: lastName, $options: 'i' };
    if (department) query.department = { $regex: department, $options: 'i' };
    if (position) query.position = { $regex: position, $options: 'i' };
    
    // Pagination, Sorting, Limiting
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Validate limit
    const maxLimit = 100;
    const effectiveLimit = Math.min(limitNum, maxLimit);

    // Build sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    // Get total count matching the search query
    const totalMatchingEmployees = await Employee.countDocuments(query);

    // Execute query with filtering, pagination, sorting, limiting
    const employees = await Employee.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(effectiveLimit);
    
    res.status(200).json({
      success: true,
      total: totalMatchingEmployees,
      page: pageNum,
      limit: effectiveLimit,
      totalPages: Math.ceil(totalMatchingEmployees / effectiveLimit),
      count: employees.length, // Count on the current page
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error searching employees: ' + error.message
    });
  }
};

// HEAD request for all employees - returns only headers, no body
exports.headEmployees = async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    res.set('X-Total-Count', count.toString());
    res.set('X-Resource-Type', 'Employees');
    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
};

// OPTIONS request for employees collection - returns allowed methods
exports.getEmployeeOptions = async (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS');
  res.status(200).end();
};

// HEAD request for single employee - returns only headers, no body
exports.headEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).end();
    }
    
    res.set('X-Resource-Type', 'Employee');
    res.set('X-Last-Modified', employee.updatedAt || employee.dateEmployed);
    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
};

// OPTIONS request for single employee - returns allowed methods
exports.getEmployeeIdOptions = async (req, res) => {
  res.set('Allow', 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS');
  res.status(200).end();
};

// PATCH an employee - partial update
exports.patchEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    // Only update fields that are provided in the request body
    Object.keys(req.body).forEach(key => {
      // Handle nested emergency contact object
      if (key === 'emergencyContact' && typeof req.body.emergencyContact === 'object') {
        employee.emergencyContact = {
          ...employee.emergencyContact,
          ...req.body.emergencyContact
        };
      } else {
        employee[key] = req.body[key];
      }
    });
    
    await employee.save();
    
    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// BULK OPERATIONS
exports.bulkCreateEmployees = async (req, res) => {
    // Expect req.body to be an array of employee objects
    if (!Array.isArray(req.body)) {
        return res.status(400).json({ success: false, error: 'Request body must be an array of employees.' });
    }
    if (req.body.length === 0) {
        return res.status(400).json({ success: false, error: 'Request body array cannot be empty.' });
    }

    try {
        const options = { ordered: false, runValidators: true }; 
        const result = await Employee.insertMany(req.body, options);
        
        res.status(201).json({ 
            success: true, 
            message: `Successfully inserted ${result.length} employees.`, 
            insertedCount: result.length,
            // data: result // Optionally return inserted documents
        });

    } catch (error) {
        console.error("Bulk employee insert error:", error);
        if (error.name === 'MongoBulkWriteError' && error.writeErrors) {
            const validationErrors = error.writeErrors.map(err => ({
                index: err.index,
                code: err.code,
                message: err.errmsg
            }));
            return res.status(400).json({ 
                success: false, 
                error: 'Bulk operation failed due to validation errors.', 
                validationErrors 
            });
        } else if (error.name === 'ValidationError') {
             res.status(400).json({ success: false, error: error.message });
        }
        else {
             res.status(500).json({ success: false, error: 'Server error during bulk employee creation.' });
        }
    }
};
