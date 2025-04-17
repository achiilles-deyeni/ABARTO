const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot be more than 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [
        /^(\+\d{1,3}[- ]?)?\d{10,14}$/,
        "Please enter a valid phone number",
      ],
    },
    DOB: {
      type: Date,
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
      min: [0, "Salary cannot be negative"],
    },
    portfolio: {
      type: String,
      trim: true,
    },
    dateEmployed: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function (value) {
          // Basic validation: must be in the past or present
          return value <= new Date();
        },
        message: "Employment date cannot be in the future",
      },
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
    // If implementing authentication, add password field:
    /* 
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in query results by default
  },
  */
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

// Virtual for full name
AdminSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Index for faster queries
AdminSchema.index({ email: 1 });
AdminSchema.index({ lastName: 1, firstName: 1 });

// If implementing authentication, add pre-save middleware for password hashing:
/*
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare entered password with hashed password
AdminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
*/

module.exports = mongoose.model("Admin", AdminSchema);
