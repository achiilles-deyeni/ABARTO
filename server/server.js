// Specify the path to the .env file relative to the root directory
require("dotenv").config({ path: "./server/.env" });

// Importing the needed modules
const express = require("express");
const cookieParser = require("cookie-parser");
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
// const authRouter = require("./routers/auth"); // Uncomment if needed

// initializing the modules
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Middleware
const errorHandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger"); // Import logger
const apiLimiter = require("./middleware/rateLimiter"); // Import rate limiter

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

// Initialization of the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
