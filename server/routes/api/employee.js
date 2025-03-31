const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/employeeController');

// GET all employees and POST new employee
router.route('/')
  .get(employeeController.getAllEmployees)
  .post(employeeController.createEmployee);

// GET, PUT, DELETE employee by ID
router.route('/:id')
  .get(employeeController.getEmployeeById)
  .put(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

// Search employees
router.route('/search')
  .get(employeeController.searchEmployees);

module.exports = router;
