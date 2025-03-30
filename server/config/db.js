const mongoose = require("mongoose");

// Database configuration
mongoose
  .connect("mongodb://127.0.0.1:27017/backend", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection established");
  })
  .catch((err) => console.log("Error connecting"));
const db = mongoose.connection;
