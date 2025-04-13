const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/employeeController');

// GET all employees and POST new employee
router.route('/')
  .get(employeeController.getAllEmployees)
  .post(employeeController.createEmployee)
  .head(employeeController.headEmployees)
  .options(employeeController.getEmployeeOptions);

// Search employees - MUST come BEFORE the /:id route to avoid being treated as an ID
router.route('/search')
  .get(employeeController.searchEmployees);

// GET, PUT, DELETE, PATCH employee by ID
router.route('/:id')
  .get(employeeController.getEmployeeById)
  .put(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee)
  .patch(employeeController.patchEmployee)
  .head(employeeController.headEmployee)
  .options(employeeController.getEmployeeIdOptions);

module.exports = router;
