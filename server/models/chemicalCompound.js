const mongoose = require("mongoose");
// chemical compounds model

const ChemicalCompoundSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  molecularFormula: { type: String, required: true },
  molecularWeight: { type: Number, required: true },
  molecularDensity: { type: Number, required: true },
  boilingPoint: { type: Number },
  meltingPoint: { type: Number },
  color: { type: String },
  toxicity: { type: String },
  bioavailability: { type: String },
});

module.exports = mongoose.model("chemicals", ChemicalCompoundSchema);
