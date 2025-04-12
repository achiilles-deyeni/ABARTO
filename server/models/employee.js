const mongoose = require("mongoose");

// Employee model
const EmployeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true, index: true },
  lastName: { type: String, required: true, index: true },
  DOB: { type: Date, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  salary: { type: Number, required: true, index: true },
  department: { type: String, required: true, index: true },
  position: { type: String, required: true, index: true },
  address: { type: String, required: true },
  emergencyContact: {
    name: { type: String },
    relationship: { type: String },
    phoneNumber: { type: String },
  },
  dateEmployed: { type: Date, default: Date.now, index: true },
}, {
  timestamps: true
});

// Optional: Compound index for common searches
// EmployeeSchema.index({ lastName: 1, firstName: 1 });
// EmployeeSchema.index({ department: 1, position: 1 });

module.exports = mongoose.model("Employee", EmployeeSchema);
