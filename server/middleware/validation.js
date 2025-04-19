const { validationResult } = require("express-validator");

// Middleware to handle validation errors from express-validator chains
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); // No errors, proceed to the next middleware/handler
  }

  // Extract validation errors
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg })); // Use err.path instead of err.param

  // Send 422 Unprocessable Entity response with validation errors
  return res.status(422).json({
    success: false,
    error: "Validation Failed",
    validationErrors: extractedErrors,
  });
};

module.exports = {
  validate,
  // Specific validation chains will be defined elsewhere (e.g., routes) and imported as needed
};
