const mongoose = require("mongoose");

// products models
const productSchema = new mongoose.Schema({
  name: { type: "string", required: true },
  price: { type: "number", required: true },
  description: { type: "string", required: true },
  category: { type: "string", required: true },
  quantity: { type: "number", required: true },
  rating: { type: "number", required: true },
});

module.exports = mongoose.model("products", productSchema);
