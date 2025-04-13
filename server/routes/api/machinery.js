const express = require("express");
const router = express.Router();
const machines = require("../../models/machineryPart");

// Route to add machines
router.post("/insert-machine", async (req, res) => {
  try {
    const { name, type, quantity, price, description } = req.body;

    // Input validation
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Name and type are required!",
      });
    }

    const machine = await machines.findOne({ name });
    if (machine) {
      return res
        .status(409) // Changed from 402 to 409 (Conflict)
        .json({ success: false, message: "Machine already exists!" });
    }

    const newMachine = new machines({
      name,
      type,
      quantity,
      price,
      description,
    });

    const result = await newMachine.save();

    return res.status(201).json({
      success: true,
      message: "Machine added successfully!",
      result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Route to update a machine
router.patch("/:id", async (req, res) => {
  try {
    // Using findByIdAndUpdate for atomic updates
    const updatedMachine = await machines.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        quantity: req.body.quantity,
        type: req.body.type,
      },
      { new: true, runValidators: true }
    );

    if (!updatedMachine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Machine updated successfully!",
      machine: updatedMachine,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Route to delete a machine
router.delete("/:id", async (req, res) => {
  // Changed from GET to DELETE
  try {
    const deletedMachine = await machines.findByIdAndDelete(req.params.id); // Use params, not body

    if (!deletedMachine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found!",
      });
    }

    return res.status(200).json({
      // Changed from 500 to 200
      success: true,
      message: "Machine deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Route to get a specific machine
router.get("/:id", async (req, res) => {
  try {
    const machine = await machines.findById(req.params.id);

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: "Machine not found!",
      });
    }

    return res.status(200).json({
      success: true,
      machine,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Route to view all machines
router.get("/", async (req, res) => {
  try {
    const machinesList = await machines.find();

    return res.status(200).json({
      success: true,
      count: machinesList.length,
      machines: machinesList,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
