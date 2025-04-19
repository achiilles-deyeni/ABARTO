const mongoose = require("mongoose");

const IndustrialSupplySchema = new mongoose.Schema({
  name: { type: String, required: true, index: true, unique: true },
  supplier: { type: String, required: true, index: true },
  description: { type: String },
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true }, // e.g., kg, liter, unit, box
  pricePerUnit: { type: Number, required: true },
  category: { type: String, index: true }, // e.g., Solvents, Lubricants, Adhesives
  lastRestocked: { type: Date },
}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model("IndustrialSupply", IndustrialSupplySchema); 