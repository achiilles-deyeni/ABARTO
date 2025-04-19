const Employee = require("../models/employee");

// Get all employees with pagination, sorting and filtering
exports.getAllEmployees = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      ...filterParams
    } = req.query;

    // Build query from filter parameters
    const query = {};
    for (const [key, value] of Object.entries(filterParams)) {
      // Handle numeric ranges with comma-separated values (min,max)
      if (
        value.includes(",") &&
        !isNaN(value.split(",")[0]) &&
        !isNaN(value.split(",")[1])
      ) {
        const [min, max] = value.split(",").map(Number);
        query[key] = { $gte: min, $lte: max };
      }
      // Handle text search with regex
      else if (typeof value === "string") {
        query[key] = { $regex: value, $options: "i" };
      }
      // Handle other cases
      else {
        query[key] = value;
      }
    }

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort direction
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination and sorting
    const employees = await Employee.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    // Get total count for pagination metadata
    const total = await Employee.countDocuments(query);

    res.status(200).json({
      success: true,
      count: employees.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
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
        error: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, department, position } = req.body;

    // Check if employee already exists (using email as unique identifier)
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: "Employee with this email already exists",
      });
    }

    const employee = await Employee.create(req.body);

    res.status(201).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    // Differentiate between validation errors and server errors
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(500).json({
        success: false,
        error: "Server error during employee creation",
      });
    }
  }
};

// Bulk create employees
exports.bulkCreateEmployees = async (req, res) => {
  try {
    // Validate that the body is an array
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        error: "Request body should be an array of employees",
      });
    }

    // Use insertMany for bulk operation
    const employees = await Employee.insertMany(req.body, {
      ordered: false, // Continues inserting documents even if one fails
      rawResult: true, // Returns additional info about the operation
    });

    res.status(201).json({
      success: true,
      inserted: employees.insertedCount,
      data: employees.ops, // The inserted documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update an employee (PUT - replace)
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the modified document
      runValidators: true, // Run model validation
      overwrite: true, // Ensures it's a PUT (replace) operation
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(500).json({
        success: false,
        error: "Server error during employee update",
      });
    }
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      data: {}, // Optionally return the deleted object or empty object
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Bulk delete employees
exports.bulkDeleteEmployees = async (req, res) => {
  try {
    // Check if we have an array of IDs
    if (!Array.isArray(req.body.ids)) {
      return res.status(400).json({
        success: false,
        error: "Request body should contain an array of IDs to delete",
      });
    }

    const result = await Employee.deleteMany({ _id: { $in: req.body.ids } });

    res.status(200).json({
      success: true,
      deleted: result.deletedCount,
      message: `${result.deletedCount} employees deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Advanced search employees with complex queries
exports.searchEmployees = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      department,
      position,
      minSalary,
      maxSalary,
      query = {},
    } = req.query;

    // Build the query object for MongoDB
    if (firstName) query.firstName = { $regex: firstName, $options: "i" };
    if (lastName) query.lastName = { $regex: lastName, $options: "i" };
    if (department) query.department = { $regex: department, $options: "i" };
    if (position) query.position = { $regex: position, $options: "i" };

    // Add salary range query if provided
    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.$gte = parseFloat(minSalary);
      if (maxSalary) query.salary.$lte = parseFloat(maxSalary);
    }

    // Handle pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Handle sorting
    const sortField = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const sort = {};
    sort[sortField] = sortOrder;

    // Execute query with cursor for efficient large result handling
    const cursor = Employee.find(query).sort(sort).cursor();

    const employees = [];
    let count = 0;

    // Skip documents for pagination
    for (let i = 0; i < skip; i++) {
      const hasNext = await cursor.next();
      if (!hasNext) break;
    }

    // Fetch limited number of documents
    for (let i = 0; i < limit; i++) {
      const employee = await cursor.next();
      if (!employee) break;
      employees.push(employee);
      count++;
    }

    // Get total count for pagination
    const total = await Employee.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Aggregation endpoints

// Get employee statistics
exports.getEmployeeStats = async (req, res) => {
  try {
    const stats = await Employee.aggregate([
      {
        $group: {
          _id: null,
          totalEmployees: { $sum: 1 },
          avgSalary: { $avg: "$salary" },
          minSalary: { $min: "$salary" },
          maxSalary: { $max: "$salary" },
          totalSalary: { $sum: "$salary" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get employees by department with count and average salary
exports.getEmployeesByDepartment = async (req, res) => {
  try {
    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
          avgSalary: { $avg: "$salary" },
          totalSalary: { $sum: "$salary" },
        },
      },
      {
        $sort: { count: -1 }, // Sort by count in descending order
      },
    ]);

    res.status(200).json({
      success: true,
      count: departmentStats.length,
      data: departmentStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// HEAD request for all employees
exports.headEmployees = async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    res.set("X-Total-Count", count.toString());
    res.set("X-Resource-Type", "Employees");
    // Add cache control headers
    res.set("Cache-Control", "max-age=60"); // Cache for 60 seconds
    res.status(200).end();
  } catch (error) {
    res.status(500).end(); // HEAD should not return a body on error
  }
};

// OPTIONS request for employees collection
exports.getEmployeeOptions = (req, res) => {
  res.set("Allow", "GET, POST, HEAD, OPTIONS");
  res.status(200).end();
};

// HEAD request for single employee
exports.headEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select(
      "updatedAt createdAt"
    );

    if (!employee) {
      return res.status(404).end();
    }

    res.set("X-Resource-Type", "Employee");
    if (employee.updatedAt) {
      res.set("Last-Modified", employee.updatedAt.toUTCString());
    } else if (employee.createdAt) {
      res.set("Last-Modified", employee.createdAt.toUTCString());
    }

    // Add ETag based on updatedAt or version field
    const etag = `"${employee._id.toString()}-${new Date(
      employee.updatedAt || employee.createdAt
    ).getTime()}"`;
    res.set("ETag", etag);

    res.status(200).end();
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).end(); // Invalid ID format
    }
    res.status(500).end();
  }
};

// OPTIONS request for single employee
exports.getEmployeeIdOptions = (req, res) => {
  res.set("Allow", "GET, PUT, DELETE, PATCH, HEAD, OPTIONS");
  res.status(200).end();
};

// PATCH an employee - partial update
exports.patchEmployee = async (req, res) => {
  try {
    // Prevent overwriting the entire document with patch
    if (req.body._id) delete req.body._id; // Cannot update _id

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Use $set to apply partial updates
      {
        new: true, // Return the modified document
        runValidators: true, // Run model validation on updated fields
        context: "query", // Important for some validators
      }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(500).json({
        success: false,
        error: "Server error during employee patch",
      });
    }
  }
};

// BULK OPERATIONS
exports.bulkCreateEmployees = async (req, res) => {
  // Expect req.body to be an array of employee objects
  if (!Array.isArray(req.body)) {
    return res
      .status(400)
      .json({
        success: false,
        error: "Request body must be an array of employees.",
      });
  }
  if (req.body.length === 0) {
    return res
      .status(400)
      .json({ success: false, error: "Request body array cannot be empty." });
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
    if (error.name === "MongoBulkWriteError" && error.writeErrors) {
      const validationErrors = error.writeErrors.map((err) => ({
        index: err.index,
        code: err.code,
        message: err.errmsg,
      }));
      return res.status(400).json({
        success: false,
        error: "Bulk operation failed due to validation errors.",
        validationErrors,
      });
    } else if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res
        .status(500)
        .json({
          success: false,
          error: "Server error during bulk employee creation.",
        });
    }
  }
};
