const mongoose = require("mongoose");

// administration model

const wholesaleSchema = new mongoose.Schema({
  wholeSalerName: { type: String, required: true, unique: true },
  wholeSalerLocation: { type: String, required: true },
  wholeSalerContact: { type: String, required: true },
  wholeSalerEmail: { type: String, required: true },
  wholeSalerProducts: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  ], // referencing the product schema through ObjectId
});
const wholesale = mongoose.model("wholesale", wholesaleSchema);
