const mongoose = require("mongoose");

// administration model

const AdminSchema = new mongoose.Schema({
  firstName: { type: String, required: true, unique: true },
  lastName: { type: String, required: true },
  DOB: { type: Date, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  salary: { type: Number, required: true },
  portfolio: { type: String, required: true },
  dateEmployed: { type: Date, default: Date.now },
});
const Admin = mongoose.model("Admin", AdminSchema);
