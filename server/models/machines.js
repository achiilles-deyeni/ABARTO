const mongoose = require("mongoose");

const MachineryPartSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide machinery name"],
      trim: true,
      unique: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    type: {
      type: String,
      required: [true, "Please provide machinery type"],
      trim: true,
      enum: {
        values: [
          "Engine",
          "Transmission",
          "Hydraulic",
          "Electrical",
          "Structural",
          "Other",
        ],
        message: "{VALUE} is not a supported machinery type",
      },
    },
    partNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    quantity: {
      type: Number,
      required: [true, "Please provide quantity in stock"],
      min: [0, "Quantity cannot be negative"],
    },
    price: {
      type: Number,
      required: [true, "Please provide price information"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    weight: {
      type: Number,
      min: [0, "Weight cannot be negative"],
    },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
      unit: { type: String, enum: ["mm", "cm", "m", "inches"], default: "cm" },
    },
    location: {
      warehouse: String,
      aisle: String,
      shelf: String,
    },
    status: {
      type: String,
      enum: {
        values: ["In Stock", "Low Stock", "Out of Stock", "Discontinued"],
        message: "{VALUE} is not a valid status",
      },
      default: "In Stock",
    },
    lastOrdered: {
      type: Date,
    },
    minStockLevel: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for value of inventory
MachineryPartSchema.virtual("inventoryValue").get(function () {
  return this.price * this.quantity;
});

// Pre-save hook to update status based on quantity
MachineryPartSchema.pre("save", function (next) {
  if (this.quantity <= 0) {
    this.status = "Out of Stock";
  } else if (this.quantity <= this.minStockLevel) {
    this.status = "Low Stock";
  } else {
    this.status = "In Stock";
  }
  next();
});

// Index creation for improved query performance
MachineryPartSchema.index({ type: 1 });
MachineryPartSchema.index({ "location.warehouse": 1 });

module.exports = mongoose.model("MachineryPart", MachineryPartSchema);
