const mongoose = require("mongoose");

// administration model

const safetySchema = new mongoose.Schema({
  EquipmentName: { type: String, required: true, unique: true },
  EquipmentType: { type: String, required: true },
  EquipmentCondition: { type: String, required: true },
  EquipmentLocation: { type: String, required: true },
  EquipmentQuantity: { type: Number, required: true },
  EquipmentDateProvided: { type: Date, required: true },
});
const safety = mongoose.model("safety", safetySchema);
