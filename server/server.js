// Importing the needed modules
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const adminRoute = require("./routes/api/admin");
const productsRoute = require("./routes/api/products");
const machinesRoute = require("./routes/api/machinery");
const rawMaterialsRoute = require("./routes/api/material");

// Importing the database configuration
const db = require("./config/db");

// Importing routes
// const authRouter = require("./routers/auth");

// initializing the modules
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// using the routes
// app.use("/api/auth", authRouter);

// Initialization of the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
