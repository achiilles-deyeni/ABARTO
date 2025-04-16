const express = require("express");
const router = express.Router();
const wholesaleController = require('../../controllers/wholesaleController');
const { protect } = require('../../middleware/authMiddleware');

// Base route: /api/wholesale
router.route('/')
    .get(protect, wholesaleController.getAllWholesaleOrders)
    .post(protect, wholesaleController.createWholesaleOrder)
    .head(protect, wholesaleController.headWholesaleOrders)
    .options(wholesaleController.getWholesaleOrderOptions);

// Search route: /api/wholesale/search
router.route('/search')
    .get(protect, wholesaleController.searchWholesaleOrders);

// Single order route: /api/wholesale/:id
router.route('/:id')
    .get(protect, wholesaleController.getWholesaleOrderById)
    .put(protect, wholesaleController.updateWholesaleOrder)
    .patch(protect, wholesaleController.patchWholesaleOrder) // Generic patch for non-array fields
    .delete(protect, wholesaleController.deleteWholesaleOrder)
    .head(protect, wholesaleController.headWholesaleOrder)
    .options(wholesaleController.getWholesaleOrderIdOptions);

// Routes for managing products within an order
router.route('/:id/products')
    .patch(protect, wholesaleController.addProductToOrder); // Add product using PATCH on sub-resource

// Note: Removing a product could also use PATCH or DELETE on /:id/products/:productId
router.route('/:id/products/remove') // Example using a sub-path for removal
    .patch(protect, wholesaleController.removeProductFromOrder);

module.exports = router;
