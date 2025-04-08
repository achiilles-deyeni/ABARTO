const express = require("express");
const router = express.Router();
const machines = require("../../models/machineryPart");

// Route to add machines
router.post("/insert-machine", async (req, res) => {
  try {
    const { name, type, quantity, price, description } = req.body;
    const machine = await findOne({ name });
    if (machine) {
      return res
        .status(402)
        .json({ success: false, message: "machine already exists!" });
    }
    const newmachine = new machines({
      name,
      type,
      quantity,
      price,
      description,
    });
    const result = newmachine.save();
    res.status(201).json({
      success: true,
      message: "machine added successfully!",
      result,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//   route to update a machine
router.patch("/:id", async (req, res) => {
  try {
    const machine = machines.findById(req.params.id);
    if (!machine) {
      res.status(404).json({ message: "machine not found!" });
    }
    machines.name = req.body.name;
    machines.price = req.body.price;
    machines.description = req.body.description;
    machines.quantity = req.body.quantity;
    machines.type = req.body.type;
    await machine.save();
    res.json(machine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//   Route to delete a machine
router.get("/:id", async (req, res) => {
  try {
    const machine = machines.findById(req.body.id);
    if (!machine) {
      res.status(404).json({ message: "machine not found!" });
    }
    await machine.remove();
    res.status(500).json({ message: "machine deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//   route to view all machines
router.get("/", async (req, res) => {
  try {
    const machine = machines.find();
    res.json(machine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
