const mongoose = require("mongoose");
// importing models
const models = require("../models/index");

// Database configuration
mongoose
  .connect("mongodb://localhost:27017/groupproject")
  .then(() => {
    console.log("Database connection established");
  })
  .catch((err) => console.log("Error connecting:", err));
const db = mongoose.connection;
