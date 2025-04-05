const express = require("express");
const app = express;
const rawMaterials = require("../../models/rawMaterial");

module.exports = rawMaterialRoutes = () => {
  // Route to add rawMaterials
  app.post("/insert-rawMaterial", async (req, res) => {
    try {
      const { name, source, quantity, price, dateProvided } = req.body;
      const rawMaterial = await findOne({ name });
      if (rawMaterial) {
        return res
          .status(402)
          .json({ success: false, message: "rawMaterial already exists!" });
      }
      const newrawMaterial = new rawMaterials({
        name,
        source,
        quantity,
        price,
        dateProvided,
      });
      const result = newrawMaterial.save();
      res.status(201).json({
        success: true,
        message: "rawMaterial added successfully!",
        result,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  //   route to update a rawMaterial
  app.patch("/:id", async (req, res) => {
    try {
      const rawMaterial = rawMaterials.findById(req.params.id);
      if (!rawMaterial) {
        res.status(404).json({ message: "rawMaterial not found!" });
      }
      rawMaterials.name = req.body.name;
      rawMaterials.price = req.body.price;
      rawMaterials.dateProvided = req.body.dateProvided;
      rawMaterials.quantity = req.body.quantity;
      rawMaterials.source = req.body.source;
      await rawMaterial.save();
      res.json(rawMaterial);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  //   Route to delete a rawMaterial
  app.get("/:id", async (req, res) => {
    try {
      const rawMaterial = rawMaterials.findById(req.body.id);
      if (!rawMaterial) {
        res.status(404).json({ message: "rawMaterial not found!" });
      }
      await rawMaterial.remove();
      res.status(500).json({ message: "rawMaterial deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  //   route to view all rawMaterials
  app.get("/rawMaterials", async (req, res) => {
    try {
      const rawMaterial = rawMaterials.find();
      res.json(rawMaterial);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};
