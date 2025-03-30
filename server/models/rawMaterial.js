const mongoose = require("mongoose");

// raw materials model

const rawMaterialsSchema = new mongoose.Schema({
  Name: { type: String, required: true, unique: true },
  Source: { type: String, required: true },
  Quantity: { type: Number, required: true },
  dateProvided: { type: Date, required: true },
});
module.exports = mongoose.model("rawMaterials", rawMaterialsSchema);
