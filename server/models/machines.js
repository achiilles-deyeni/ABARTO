const mongoose = require("mongoose");

// machinery parts model
const machineryPartsSchema = new mongoose.Schema({
  name: { type: "string", required: true, unique: true },
  type: { type: "string", required: true },
  quantity: { type: "number", required: true },
  price: { type: "number", required: true },
  description: { type: "string", required: true },
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Machines",
    required: true,
  },
});
module.exports = mongoose.model("machines", machineryPartsSchema);
