// Importing the needed modules
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

// Importing the database configuration
const db = require("./config/db");

// Importing routes
const routes = require("./routes/index");

// initializing the modules
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// using the routes
app.use(routes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('ABARTO Chemical Factory API is running');
});

// Initialization of the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
