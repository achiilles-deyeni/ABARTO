const mongoose = require("mongoose");

const ChemicalCompoundSchema = new mongoose.Schema(
  {
    compoundName: {
      type: String,
      required: [true, "Please provide compound name"],
      trim: true,
      maxlength: [100, "Compound name cannot be more than 100 characters"],
    },
    formula: {
      type: String,
      required: [true, "Please provide chemical formula"],
      trim: true,
    },
    casNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      // CAS number validation could be added with a custom validator
    },
    quantity: {
      type: Number,
      required: [true, "Please provide quantity"],
      min: [0, "Quantity cannot be negative"],
    },
    unit: {
      type: String,
      required: [true, "Please provide unit of measurement"],
      enum: {
        values: ["g", "kg", "ml", "L", "mol", "mmol", "µl", "mg"],
        message: "{VALUE} is not a supported unit of measurement",
      },
    },
    molecularWeight: {
      type: Number,
      min: [0, "Molecular weight cannot be negative"],
    },
    storageLocation: {
      type: String,
      trim: true,
    },
    storageConditions: {
      temperature: {
        type: String,
        enum: {
          values: [
            "Room temperature",
            "Refrigerated",
            "Frozen",
            "Deep freeze",
            "Other",
          ],
          message: "{VALUE} is not a valid storage temperature",
        },
        default: "Room temperature",
      },
      light: {
        type: String,
        enum: {
          values: ["No special requirements", "Protect from light", "Other"],
          message: "{VALUE} is not a valid light condition",
        },
        default: "No special requirements",
      },
      atmosphere: {
        type: String,
        enum: {
          values: [
            "No special requirements",
            "Under nitrogen",
            "Under argon",
            "Other",
          ],
          message: "{VALUE} is not a valid atmosphere condition",
        },
        default: "No special requirements",
      },
    },
    hazardClass: {
      type: String,
      enum: {
        values: [
          "Not hazardous",
          "Flammable",
          "Corrosive",
          "Toxic",
          "Oxidizer",
          "Explosive",
          "Carcinogenic",
          "Environmental hazard",
          "Other",
        ],
        message: "{VALUE} is not a recognized hazard class",
      },
      default: "Not hazardous",
    },
    safetySheetUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // Basic URL validation
          return (
            !v ||
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v)
          );
        },
        message: (props) => `${props.value} is not a valid URL`,
      },
    },
    supplier: {
      type: String,
      trim: true,
    },
    purity: {
      type: Number,
      min: [0, "Purity cannot be negative"],
      max: [100, "Purity cannot exceed 100%"],
    },
    expirationDate: {
      type: Date,
    },
    dateReceived: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: {
        values: [
          "In Stock",
          "Low Stock",
          "Out of Stock",
          "Expired",
          "Discarded",
        ],
        message: "{VALUE} is not a valid status",
      },
      default: "In Stock",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot be more than 1000 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for days until expiration
ChemicalCompoundSchema.virtual("daysUntilExpiration").get(function () {
  if (!this.expirationDate) return null;

  const today = new Date();
  const expDate = new Date(this.expirationDate);
  const diffTime = expDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save hook to update status based on quantity and expiration
ChemicalCompoundSchema.pre("save", function (next) {
  // Check if expired
  if (this.expirationDate && new Date(this.expirationDate) < new Date()) {
    this.status = "Expired";
  }
  // Check if out of stock
  else if (this.quantity <= 0) {
    this.status = "Out of Stock";
  }
  // Check if low stock (arbitrary threshold - could be customized per chemical)
  else if (this.quantity < 10) {
    this.status = "Low Stock";
  }
  // Otherwise in stock
  else {
    this.status = "In Stock";
  }
  next();
});

// Index creation for improved query performance
ChemicalCompoundSchema.index({ compoundName: 1 });
ChemicalCompoundSchema.index({ formula: 1 });
ChemicalCompoundSchema.index({ hazardClass: 1 });
ChemicalCompoundSchema.index({ status: 1 });

module.exports = mongoose.model("ChemicalCompound", ChemicalCompoundSchema);
