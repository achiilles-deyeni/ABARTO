// server/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Default to 500 if status code is still 200
  let message = "Server Error";
  let success = false;

  console.error("ERROR STACK:", err.stack);
  console.error("ERROR MESSAGE:", err.message);

  // Mongoose Bad ObjectId (CastError)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400; // Bad Request
    message = `Invalid ID format: ${err.path} = ${err.value}`; // More specific message
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400; // Bad Request
    // Combine multiple validation errors into one message
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    statusCode = 400; // Bad Request
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for '${field}'. Please use another value.`;
  }

  // Custom Application Errors (if you define them)
  // if (err instanceof CustomError) {
  //     statusCode = err.statusCode;
  //     message = err.message;
  // }

  res.status(statusCode).json({
    success: success,
    error: message,
    // Optionally include stack trace in development
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
