// In your models/products.js file

const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a product name"],
    unique: true,
    index: true, // Create an index on the name field
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
    index: true, // Create an index on the price field
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: [true, "Please add a category"],
    index: true, // Create an index on the category field
  },
  quantity: {
    type: Number,
    default: 0,
    index: true, // Create an index on the quantity field
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for common search patterns
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ name: "text", description: "text" }); // Text index for full-text search

// Update the updatedAt field on update
ProductSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
