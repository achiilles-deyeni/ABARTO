const express = require("express");
const router = express.Router();
const employeeController = require("../../controllers/employeeController");

// OPTIONS for collection
router.options("/", employeeController.getEmployeeOptions);

// HEAD for collection
router.head("/", employeeController.headEmployees);

// GET all employees with filtering, pagination, sorting
router.get("/", employeeController.getAllEmployees);

// POST - Create new employee
router.post("/", employeeController.createEmployee);

// Bulk operations
router.post("/bulk", employeeController.bulkCreateEmployees);
router.delete("/bulk", employeeController.bulkDeleteEmployees);

// Advanced search
router.get("/search", employeeController.searchEmployees);

// Analytics and aggregation endpoints
router.get("/stats", employeeController.getEmployeeStats);
router.get("/departments", employeeController.getEmployeesByDepartment);

// OPTIONS for single item
router.options("/:id", employeeController.getEmployeeIdOptions);

// HEAD for single item
router.head("/:id", employeeController.headEmployee);

// Single employee routes
router.get("/:id", employeeController.getEmployeeById);
router.put("/:id", employeeController.updateEmployee);
router.patch("/:id", employeeController.patchEmployee);
router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;
