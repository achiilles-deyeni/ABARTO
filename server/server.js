// Specify the path to the .env file relative to the root directory
require('dotenv').config({ path: './server/.env' });

// Importing the needed modules
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors'); // Import cors package
const app = express();

// Importing the database configuration
const db = require("./config/db"); // Ensure this connects to your DB

// Importing routes
const adminRoute = require("./routes/api/admin");
const productsRoute = require("./routes/api/products");
const machinesRoute = require("./routes/api/machinery");
const rawMaterialsRoute = require("./routes/api/material");
const employeeRoute = require("./routes/api/employee");
const supplyRoute = require("./routes/api/supply");
const wholesaleRoute = require("./routes/api/wholesale");
const securityRoute = require("./routes/api/security");
const reportRoute = require("./routes/api/report");
const safetyRoute = require("./routes/api/safety");
const chemicalRoute = require("./routes/api/chemical");
const authRoute = require("./routes/api/auth"); // Import the new auth route
// const authRouter = require("./routers/auth"); // Uncomment if needed

// Import Middleware
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger'); // Import logger
const apiLimiter = require('./middleware/rateLimiter'); // Import rate limiter

// Enable CORS
// IMPORTANT: For development, allow specific origin. For production, configure allowed origins more strictly.
const corsOptions = {
    origin: 'http://localhost:5173', // Allow requests from your React app
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// initializing the modules
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply core middleware BEFORE routes
app.use(logger); // Log requests
app.use(apiLimiter); // Apply rate limiting to all API requests

// using the routes
app.use("/api/admins", adminRoute);
app.use("/api/products", productsRoute);
app.use("/api/machinery", machinesRoute);
app.use("/api/materials", rawMaterialsRoute); // Note: Pluralized path
app.use("/api/employees", employeeRoute);
app.use("/api/supplies", supplyRoute);
app.use("/api/wholesale", wholesaleRoute);
app.use("/api/security", securityRoute);
app.use("/api/reports", reportRoute);
app.use("/api/safety", safetyRoute);
app.use("/api/chemicals", chemicalRoute);
app.use("/api/auth", authRoute); // Use the auth route
// app.use("/api/auth", authRouter); // Uncomment if needed

// Apply Error Handling Middleware (AFTER all routes)
app.use(errorHandler);

// Initialization of the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
