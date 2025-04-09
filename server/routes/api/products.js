const express = require("express");
const router = express.Router();
const products = require("../../models/products");

// Route to add products
router.post("/insert-product", async (req, res) => {
  try {
    const { name, price, description, category, quantity, rating } = req.body;
    const product = await product.findOne({ name });
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
    const result = await newProduct.save();
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
router.patch("/:id", async (req, res) => {
  try {
    const product = products.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found!" });
    }
    product.name = req.body.name;
    product.price = req.body.price;
    product.description = req.body.description;
    product.category = req.body.category;
    product.quantity = req.body.quantity;
    product.rating = req.body.rating;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//   Route to delete a product
router.get("/:id", async (req, res) => {
  try {
    const product = await products.findById(req.params.id);
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
router.get("/", async (req, res) => {
  try {
    const product = await products.find();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
