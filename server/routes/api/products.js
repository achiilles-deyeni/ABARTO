const express = require("express");
const router = express.Router();
const productController = require('../../controllers/productController');
const { protect } = require('../../middleware/authMiddleware');

// GET all products, POST new product, HEAD, OPTIONS
router.route('/')
    .get(productController.getAllProducts)
    .post(protect, productController.createProduct)
    .head(productController.headProducts)
    .options(productController.getProductOptions);

// Search products - MUST come BEFORE the /:id route
router.route('/search')
    .get(productController.searchProducts);

// BULK OPERATIONS ROUTE - Place before /:id
router.route('/bulk')
    .post(protect, productController.bulkCreateProducts);

// GET, PUT, DELETE, PATCH, HEAD, OPTIONS product by ID
router.route('/:id')
    .get(productController.getProductById)
    .put(protect, productController.updateProduct)
    .delete(protect, productController.deleteProduct)
    .patch(protect, productController.patchProduct)
    .head(productController.headProduct)
    .options(productController.getProductIdOptions);

module.exports = router;
