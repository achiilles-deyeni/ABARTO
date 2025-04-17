const mongoose = require("mongoose");

// Define the maintenance history schema as a sub-document
const MaintenanceHistorySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "inspection",
        "maintenance",
        "certification",
        "repair",
        "calibration",
        "other",
      ],
      default: "inspection",
    },
    details: {
      type: String,
      trim: true,
    },
    performedBy: {
      type: String,
      required: true,
      trim: true,
    },
    result: {
      type: String,
      enum: [
        "Passed",
        "Failed",
        "Completed",
        "Incomplete",
        "Requires Follow-up",
      ],
      default: "Completed",
    },
    attachments: [
      {
        name: String,
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
  }
);

// Define the safety equipment schema
const SafetyEquipmentSchema = new mongoose.Schema(
  {
    equipmentName: {
      type: String,
      required: [true, "Please provide equipment name"],
      trim: true,
      maxlength: [100, "Equipment name cannot be more than 100 characters"],
    },
    equipmentType: {
      type: String,
      required: [true, "Please provide equipment type"],
      enum: {
        values: [
          "fire extinguisher",
          "first aid kit",
          "eyewash station",
          "safety shower",
          "spill kit",
          "respirator",
          "gas detector",
          "emergency light",
          "fume hood",
          "radiation detector",
          "emergency stop",
          "air quality monitor",
          "critical",
          "other",
        ],
        message: "{VALUE} is not a recognized equipment type",
      },
      default: "other",
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    modelNumber: {
      type: String,
      trim: true,
    },
    serialNumber: {
      type: String,
      trim: true,
      index: true,
    },
    purchaseDate: {
      type: Date,
    },
    warrantyExpirationDate: {
      type: Date,
    },
    lastInspectionDate: {
      type: Date,
    },
    nextInspectionDate: {
      type: Date,
      required: [true, "Please provide next inspection date"],
    },
    maintenanceInterval: {
      type: Number,
      min: [1, "Maintenance interval must be at least 1 day"],
      default: 90, // 90 days default
    },
    lastMaintenanceDate: {
      type: Date,
    },
    status: {
      type: String,
      required: [true, "Please provide status"],
      enum: {
        values: [
          "Operational",
          "Needs Inspection",
          "Needs Repair",
          "Under Maintenance",
          "Out of Service",
          "Expired",
          "Missing",
          "Damaged",
          "Replaced",
        ],
        message: "{VALUE} is not a valid status",
      },
      default: "Operational",
    },
    location: {
      building: {
        type: String,
        trim: true,
      },
      room: {
        type: String,
        trim: true,
      },
      specificLocation: {
        type: String,
        trim: true,
      },
      // Combined field for simpler queries
      fullLocation: {
        type: String,
        trim: true,
      },
    },
    responsiblePerson: {
      name: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please provide a valid email",
        ],
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    certificationRequired: {
      type: Boolean,
      default: false,
    },
    certificationExpiryDate: {
      type: Date,
    },
    maintenanceHistory: [MaintenanceHistorySchema],
    attachments: [
      {
        name: String,
        fileUrl: String,
        fileType: String,
        description: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot be more than 1000 characters"],
    },
    hazardClass: {
      type: String,
      enum: {
        values: [
          "None",
          "Electrical",
          "Mechanical",
          "Chemical",
          "Biological",
          "Radiation",
          "Fire",
          "Pressure",
          "Other",
        ],
        message: "{VALUE} is not a recognized hazard class",
      },
      default: "None",
    },
    criticalEquipment: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save hook to update status based on dates
SafetyEquipmentSchema.pre("save", function (next) {
  // Create full location string from components
  if (
    this.location &&
    (this.location.building ||
      this.location.room ||
      this.location.specificLocation)
  ) {
    this.location.fullLocation = [
      this.location.building,
      this.location.room,
      this.location.specificLocation,
    ]
      .filter(Boolean)
      .join(" - ");
  }

  const today = new Date();

  // Check for expired certification
  if (
    this.certificationRequired &&
    this.certificationExpiryDate &&
    new Date(this.certificationExpiryDate) < today
  ) {
    this.status = "Expired";
  }
  // Check for missed inspection
  else if (
    new Date(this.nextInspectionDate) < today &&
    this.status === "Operational"
  ) {
    this.status = "Needs Inspection";
  }

  next();
});

// Virtual for days until next inspection
SafetyEquipmentSchema.virtual("daysUntilInspection").get(function () {
  if (!this.nextInspectionDate) return null;

  const today = new Date();
  const nextDate = new Date(this.nextInspectionDate);
  const diffTime = nextDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for warranty status
SafetyEquipmentSchema.virtual("warrantyStatus").get(function () {
  if (!this.warrantyExpirationDate) return "Unknown";

  const today = new Date();
  if (new Date(this.warrantyExpirationDate) < today) {
    return "Expired";
  }
  return "Active";
});

// Create indexes for improved query performance
SafetyEquipmentSchema.index({ equipmentName: 1 });
SafetyEquipmentSchema.index({ equipmentType: 1 });
SafetyEquipmentSchema.index({ "location.fullLocation": 1 });
SafetyEquipmentSchema.index({ nextInspectionDate: 1 });
SafetyEquipmentSchema.index({ status: 1 });
SafetyEquipmentSchema.index({ certificationExpiryDate: 1 });
SafetyEquipmentSchema.index({ "responsiblePerson.name": 1 });

module.exports = mongoose.model("SafetyEquipment", SafetyEquipmentSchema);
