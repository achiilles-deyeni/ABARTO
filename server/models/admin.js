const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot be more than 50 characters"],
      index: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot be more than 50 characters"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^(\+\d{1,3}[- ]?)?\d{10,14}$/,
        "Please enter a valid phone number",
      ],
    },
    DOB: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          // Basic validation: must be in the past
          return value < new Date();
        },
        message: "Date of birth must be in the past",
      },
    },
    salary: {
      type: Number,
      required: true,
      min: [0, "Salary cannot be negative"],
    },
    portfolio: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    dateEmployed: {
      type: Date,
      default: Date.now,
      index: true,
      validate: {
        validator: function (value) {
          // Basic validation: must be in the past or present
          return value <= new Date();
        },
        message: "Employment date cannot be in the future",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in query results by default
    },
    role: {
      type: String,
      enum: ["admin", "super-admin", "manager"],
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    permissions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Optional: Compound index
// AdminSchema.index({ lastName: 1, firstName: 1 });

module.exports = mongoose.model("Admin", AdminSchema);
