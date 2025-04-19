// In your models/products.js file

const mongoose = require("mongoose");

<<<<<<< HEAD
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
=======
// products models
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  price: { type: Number, required: true, index: true },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  quantity: { type: Number, required: true, index: true },
  rating: { type: Number, required: true, index: true }
}, {
  timestamps: true
});

// Optional: Compound index if frequently searching/sorting by multiple fields together
// productSchema.index({ category: 1, price: -1 }); 

// Optional: Text index for description search (if needed)
// productSchema.index({ description: 'text' });

module.exports = mongoose.model("Product", productSchema);
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11
