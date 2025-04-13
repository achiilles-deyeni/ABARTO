const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController");

// Route to add products
router.post("/add-product", async (req, res) => {
  try {
    const { name, price, description, category, quantity, rating } = req.body;

    // Input validation
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required!",
      });
    }

    const product = await products.findOne({ name });
    if (product) {
      return res.status(409).json({
        success: false,
        message: "Product already exists!",
      });
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
    return res.status(201).json({
      success: true,
      message: "Product added successfully!",
      result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Route to update a product
router.patch("/:id", async (req, res) => {
  try {
    const { name, price, description, category, quantity, rating } = req.body;

    // Using findByIdAndUpdate for atomic updates
    const updatedProduct = await products.findByIdAndUpdate(
      req.params.id,
      { name, price, description, category, quantity, rating },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Route to delete a product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await products.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Route to get a specific product
router.get("/:id", async (req, res) => {
  try {
    const product = await products.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Route to view all products
router.get("/", async (req, res) => {
  try {
    const productList = await products.find();

    return res.status(200).json({
      success: true,
      count: productList.length,
      products: productList,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
module.exports = router;
