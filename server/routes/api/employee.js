const express = require("express");
const router = express.Router();
<<<<<<< HEAD
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
=======
const employeeController = require('../../controllers/employeeController');
const { protect } = require('../../middleware/authMiddleware');

// GET all employees and POST new employee
router.route('/')
  .get(protect, employeeController.getAllEmployees)
  .post(protect, employeeController.createEmployee)
  .head(protect, employeeController.headEmployees)
  .options(employeeController.getEmployeeOptions);

// Search employees - MUST come BEFORE the /:id route to avoid being treated as an ID
router.route('/search')
  .get(protect, employeeController.searchEmployees);

// BULK OPERATIONS ROUTE - Place before /:id
router.route('/bulk')
    .post(protect, employeeController.bulkCreateEmployees);

// GET, PUT, DELETE, PATCH employee by ID
router.route('/:id')
  .get(protect, employeeController.getEmployeeById)
  .put(protect, employeeController.updateEmployee)
  .delete(protect, employeeController.deleteEmployee)
  .patch(protect, employeeController.patchEmployee)
  .head(protect, employeeController.headEmployee)
  .options(employeeController.getEmployeeIdOptions);
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11

module.exports = router;
