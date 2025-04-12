const mongoose = require("mongoose");

// administration model

const AdminSchema = new mongoose.Schema({
  firstName: { type: String, required: true, index: true },
  lastName: { type: String, required: true, index: true },
  DOB: { type: Date, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: [true, 'Password is required'], select: false },
  salary: { type: Number, required: true },
  portfolio: { type: String, required: true, index: true },
  dateEmployed: { type: Date, default: Date.now, index: true },
}, {
  timestamps: true
});

// Optional: Compound index
// AdminSchema.index({ lastName: 1, firstName: 1 });

module.exports = mongoose.model("Admin", AdminSchema);
