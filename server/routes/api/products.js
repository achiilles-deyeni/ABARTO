const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController");

// OPTIONS for collection
router.options("/", productController.getProductOptions);

// HEAD for collection
router.head("/", productController.headProducts);

// GET all products with filtering, pagination, sorting
router.get("/", productController.getAllProducts);

// POST - Create new product
router.post("/", productController.createProduct);

// Bulk operations
router.post("/bulk", productController.bulkCreateProducts);
router.delete("/bulk", productController.bulkDeleteProducts);

// Advanced search
router.get("/search", productController.searchProducts);

// Analytics and aggregation endpoints
router.get("/stats", productController.getProductStats);
router.get("/categories", productController.getProductsByCategory);
router.get("/top-rated", productController.getTopRatedProducts);
router.get("/low-stock", productController.getLowStockProducts);

// OPTIONS for single item
router.options("/:id", productController.getProductIdOptions);

// HEAD for single item
router.head("/:id", productController.headProduct);

// Single product routes
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.patch("/:id", productController.patchProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
