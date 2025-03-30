const mongoose = require("mongoose");

// administration model

const rawMaterialsSchema = new mongoose.Schema({
  Name: { type: String, required: true, unique: true },
  Source: { type: String, required: true },
  Quantity: { type: Number, required: true },
  dateProvided: { type: Date, required: true },
});
const rawMaterials = mongoose.model("rawMaterials", rawMaterialsSchema);
