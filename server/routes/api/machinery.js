const express = require("express");
const app = express;
const machines = require("../../models/machineryPart");

module.exports = machinesRoutes = () => {
  // Route to add machines
  app.post("/insert-machine", async (req, res) => {
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
  app.patch("/:id", async (req, res) => {
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
  app.get("/:id", async (req, res) => {
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
  app.get("/machines", async (req, res) => {
    try {
      const machine = machines.find();
      res.json(machine);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};
