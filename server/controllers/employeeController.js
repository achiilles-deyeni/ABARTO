const Employee = require('../models/employee');

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
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
    const { firstName, lastName, department, position } = req.query;
    let query = {};
    
    if (firstName) query.firstName = { $regex: firstName, $options: 'i' };
    if (lastName) query.lastName = { $regex: lastName, $options: 'i' };
    if (department) query.department = { $regex: department, $options: 'i' };
    if (position) query.position = { $regex: position, $options: 'i' };
    
    const employees = await Employee.find(query);
    
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
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
