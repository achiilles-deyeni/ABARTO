const express = require("express");
const router = express.Router();
<<<<<<< HEAD
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
=======
const productController = require('../../controllers/productController');
const { protect } = require('../../middleware/authMiddleware');
// Import validation middleware and rules later if needed
// const { validate } = require('../../middleware/validation');
// const { createProductRules, updateProductRules } = require('../../validators/productValidators');

// GET all products, POST new product, HEAD, OPTIONS
router.route('/')
    .get(productController.getAllProducts)
    .post(/* createProductRules, validate, */ protect, productController.createProduct)
    .head(productController.headProducts)
    .options(productController.getProductOptions);

// Search products - MUST come BEFORE the /:id route
router.route('/search')
    .get(productController.searchProducts);
    // Add HEAD/OPTIONS for search if needed

// BULK OPERATIONS ROUTE - Place before /:id
router.route('/bulk')
    .post(protect, productController.bulkCreateProducts);

// GET, PUT, DELETE, PATCH, HEAD, OPTIONS product by ID
router.route('/:id')
    .get(productController.getProductById)
    .put(/* updateProductRules, validate, */ protect, productController.updateProduct)
    .delete(protect, productController.deleteProduct)
    .patch(protect, productController.patchProduct)
    .head(productController.headProduct)
    .options(productController.getProductIdOptions);
>>>>>>> 4447d4ed7ba6273a2a621c781655103b267ffe11

module.exports = router;
