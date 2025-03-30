const mongoose = require("mongoose");
// importing models
const models = require("../models/index");

// Database configuration
mongoose
  .connect(
    "mongodb+srv://achillesmann03:admin@cluster0.miqi8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connection established");
  })
  .catch((err) => console.log("Error connecting"));
const db = mongoose.connection;
