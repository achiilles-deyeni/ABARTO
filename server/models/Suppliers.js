const mongoose = require("mongoose");
// industrial supply model
const SuppliersSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
});

module.exports = mongoose.model("IndustrialSupply", SuppliersSchema);
