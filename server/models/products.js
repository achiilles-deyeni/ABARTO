const mongoose = require("mongoose");

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
