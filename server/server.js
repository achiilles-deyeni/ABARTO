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

// initializing the modules
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Initialization of the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
