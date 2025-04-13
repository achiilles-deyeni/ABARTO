const express = require("express");
const router = express.Router();
const rawMaterials = require("../../models/rawMaterial");

// Route to add raw materials
router.post("/insert-rawMaterial", async (req, res) => {
  try {
    const { name, source, quantity, price, dateProvided } = req.body;

    // Input validation
    if (!name || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Name and quantity are required!",
      });
    }

    const rawMaterial = await rawMaterials.findOne({ name });
    if (rawMaterial) {
      return res
        .status(409) // Changed from 402 to 409 (Conflict)
        .json({ success: false, message: "Raw material already exists!" });
    }

    const newRawMaterial = new rawMaterials({
      name,
      source,
      quantity,
      price,
      dateProvided,
    });

    // Added missing await
    const result = await newRawMaterial.save();

    return res.status(201).json({
      success: true,
      message: "Raw material added successfully!",
      result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Route to update a raw material
router.patch("/:id", async (req, res) => {
  try {
    // Using findByIdAndUpdate for better atomic updates
    const updatedRawMaterial = await rawMaterials.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        price: req.body.price,
        dateProvided: req.body.dateProvided,
        quantity: req.body.quantity,
        source: req.body.source,
      },
      { new: true, runValidators: true }
    );

    if (!updatedRawMaterial) {
      return res.status(404).json({
        success: false,
        message: "Raw material not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Raw material updated successfully!",
      rawMaterial: updatedRawMaterial,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Route to delete a raw material
router.delete("/:id", async (req, res) => {
  // Changed from GET to DELETE
  try {
    const deletedRawMaterial = await rawMaterials.findByIdAndDelete(
      req.params.id
    ); // Use params, not body

    if (!deletedRawMaterial) {
      return res.status(404).json({
        success: false,
        message: "Raw material not found!",
      });
    }

    return res.status(200).json({
      // Changed from 500 to 200
      success: true,
      message: "Raw material deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Route to get a specific raw material
router.get("/:id", async (req, res) => {
  try {
    const rawMaterial = await rawMaterials.findById(req.params.id);

    if (!rawMaterial) {
      return res.status(404).json({
        success: false,
        message: "Raw material not found!",
      });
    }

    return res.status(200).json({
      success: true,
      rawMaterial,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Route to view all raw materials
router.get("/", async (req, res) => {
  try {
    const rawMaterialsList = await rawMaterials.find();

    return res.status(200).json({
      success: true,
      count: rawMaterialsList.length,
      rawMaterials: rawMaterialsList,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
