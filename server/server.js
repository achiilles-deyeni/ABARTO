// Importing the needed modules
const express = require("express");
const router = express.Router();
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
app.use("/admins", adminRoute);
app.use("/products", productsRoute);
app.use("/machines", machinesRoute);
app.use("/rawmaterials", rawMaterialsRoute);

// Initialization of the port
app.listen(3000 || process.env.PORT, () => {
  console.log("Server is running on port 3000");
});
