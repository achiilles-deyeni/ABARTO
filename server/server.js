// Importing the needed modules
const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const app = express();

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
app.listen(3000 || process.env.PORT, () => {
  console.log("Server is running on port 3000");
});
