const express = require("express");
const router = express.Router();
const productController = require('../../controllers/productController');

// GET all products, POST new product, HEAD, OPTIONS
router.route('/')
    .get(productController.getAllProducts)
    .post(productController.createProduct)
    .head(productController.headProducts)
    .options(productController.getProductOptions);

// Search products - MUST come BEFORE the /:id route
router.route('/search')
    .get(productController.searchProducts);

// GET, PUT, DELETE, PATCH, HEAD, OPTIONS product by ID
router.route('/:id')
    .get(productController.getProductById)
    .put(productController.updateProduct)      // Corresponds to updateProduct (PUT)
    .delete(productController.deleteProduct)
    .patch(productController.patchProduct)     // Corresponds to patchProduct (PATCH)
    .head(productController.headProduct)
    .options(productController.getProductIdOptions);

module.exports = router;
