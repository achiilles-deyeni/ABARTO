const express = require("express");
const app = express;
const products = require("../../models/products");

module.exports = productsRoutes = () => {
  // Route to add products
  app.post("/insert-product", async (req, res) => {
    try {
      const { name, price, description, category, quantity, rating } = req.body;
      const product = await findOne({ name });
      if (product) {
        return res
          .status(402)
          .json({ success: false, message: "Product already exists!" });
      }
      const newProduct = new products({
        name,
        price,
        description,
        category,
        quantity,
        rating,
      });
      const result = newProduct.save();
      res.status(201).json({
        success: true,
        message: "Product added successfully!",
        result,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  //   route to update a product
  app.patch("/:id", async (req, res) => {
    try {
      const product = products.findById(req.params.id);
      if (!product) {
        res.status(404).json({ message: "Product not found!" });
      }
      products.name = req.body.name;
      products.price = req.body.price;
      products.description = req.body.description;
      products.category = req.body.category;
      products.quantity = req.body.quantity;
      products.rating = req.body.rating;
      await product.save();
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  //   Route to delete a product
  app.get("/:id", async (req, res) => {
    try {
      const product = products.findById(req.body.id);
      if (!product) {
        res.status(404).json({ message: "Product not found!" });
      }
      await product.remove();
      res.status(500).json({ message: "Product deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  //   route to view all products
  app.get("/products", async (req, res) => {
    try {
      const product = products.find();
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};
