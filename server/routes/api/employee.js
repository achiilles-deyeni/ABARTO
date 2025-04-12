const express = require('express');
const router = express.Router();
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

module.exports = router;
