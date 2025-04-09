const mongoose = require("mongoose");

// Employee model
const EmployeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  DOB: { type: Date, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  salary: { type: Number, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  address: { type: String, required: true },
  emergencyContact: {
    name: { type: String },
    relationship: { type: String },
    phoneNumber: { type: String },
  },
  dateEmployed: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Employee", EmployeeSchema);
