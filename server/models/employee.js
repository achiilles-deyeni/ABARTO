const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create sub-schema for emergency contact
const EmergencyContactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Emergency contact name is required"],
      trim: true,
    },
    relationship: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Emergency contact phone is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email for emergency contact",
      ],
    },
  },
  {
    _id: false, // Don't create separate IDs for subdocuments
  }
);

// Create sub-schema for address
const AddressSchema = new Schema(
  {
    street: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: "USA",
    },
  },
  {
    _id: false,
  }
);

const EmployeeSchema = new Schema(
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
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function (value) {
          // Must be in the past and employee must be at least 18
          if (!value) return true; // Allow null/undefined
          const eighteenYearsAgo = new Date();
          eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
          return value <= eighteenYearsAgo;
        },
        message: "Employee must be at least 18 years old",
      },
    },
    dateEmployed: {
      type: Date,
      default: Date.now,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"],
    },
    status: {
      type: String,
      enum: ["active", "on leave", "terminated"],
      default: "active",
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined values
    },
    address: AddressSchema,
    emergencyContact: EmergencyContactSchema,
    socialSecurityNumber: {
      type: String,
      trim: true,
      match: [
        /^\d{3}-\d{2}-\d{4}$/,
        "Please enter a valid SSN in the format XXX-XX-XXXX",
      ],
      select: false, // Not included in query results by default
    },
    bankDetails: {
      accountNumber: {
        type: String,
        trim: true,
        select: false,
      },
      routingNumber: {
        type: String,
        trim: true,
        select: false,
      },
      bankName: {
        type: String,
        trim: true,
      },
    },
    education: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],
    certifications: [
      {
        name: String,
        issuingOrganization: String,
        issueDate: Date,
        expiryDate: Date,
      },
    ],
    skills: [String],
    performanceReviews: [
      {
        date: Date,
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comments: String,
        reviewedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Admin",
        },
      },
    ],
    documents: [
      {
        title: String,
        description: String,
        fileUrl: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
EmployeeSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for employee age
EmployeeSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;

  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn't occurred yet this year
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
});

// Virtual for employment duration
EmployeeSchema.virtual("employmentDuration").get(function () {
  const startDate = new Date(this.dateEmployed);
  const endDate =
    this.status === "terminated"
      ? new Date(this.terminationDate || Date.now())
      : new Date();

  const years = endDate.getFullYear() - startDate.getFullYear();
  const months = endDate.getMonth() - startDate.getMonth();

  return {
    years,
    months: months < 0 ? months + 12 : months,
    totalMonths: years * 12 + (months < 0 ? months + 12 : months),
  };
});

// Indexes for query performance
EmployeeSchema.index({ lastName: 1, firstName: 1 });
EmployeeSchema.index({ department: 1 });
EmployeeSchema.index({ "address.zipCode": 1 });
EmployeeSchema.index({ status: 1 });

module.exports = mongoose.model("Employee", EmployeeSchema);
