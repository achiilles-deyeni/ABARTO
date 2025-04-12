const mongoose = require("mongoose");
// Supplier model
const SupplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Supplier name is required'],
    trim: true,
    unique: true, // Keep name unique for suppliers
    index: true
  },
  contactPerson: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    // Add unique constraint and validation if email should be unique
    // unique: true,
    // match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    index: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  }
  // Add any other relevant fields like 'website', 'notes', etc.
}, {
  timestamps: true // Add createdAt and updatedAt fields
});

// Export using the singular name 'Supplier'
module.exports = mongoose.model("Supplier", SupplierSchema);
