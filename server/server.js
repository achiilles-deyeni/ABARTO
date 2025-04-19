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
const materialsRoute = require("./routes/api/material");
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
    credentials: true, // Allow sending cookies/auth headers
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

app.use("/admins", adminRoute);
app.use("/products", productsRoute);
app.use("/machines", machinesRoute);
app.use("/materials", materialsRoute);
app.use("/employees", employeeRoute);
app.use("/supply", supplyRoute);
app.use("/wholesale", wholesaleRoute);
app.use("/security", securityRoute);
app.use("/report", reportRoute);
app.use("/safety", safetyRoute);
app.use("/chemicals", chemicalRoute);

app.use(errorHandler);

// Apply Error Handling Middleware (AFTER all routes)
app.use(errorHandler);

// Initialization of the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
