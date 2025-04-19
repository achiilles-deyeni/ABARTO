const wholesaleOrderService = require('../services/wholesaleOrderService');
const { getPaginationParams } = require('../utils/pagination');
const asyncHandler = require('../utils/asyncHandler');

// Get all wholesale orders
exports.getAllWholesaleOrders = asyncHandler(async (req, res, next) => {
  const paginationParams = getPaginationParams(req.query, 'wholeSalerName', 'asc'); // Default sort
  const populate = req.query.populate === 'true';
  const { orders, totalOrders } = await wholesaleOrderService.getAllWholesaleOrders(paginationParams, populate);

  res.status(200).json({
    success: true,
    total: totalOrders,
    page: paginationParams.page,
    limit: paginationParams.limit,
    totalPages: Math.ceil(totalOrders / paginationParams.limit),
    count: orders.length,
    data: orders
  });
});

// Get a single wholesale order by ID
exports.getWholesaleOrderById = asyncHandler(async (req, res, next) => {
  const populate = req.query.populate === 'true';
  const order = await wholesaleOrderService.getWholesaleOrderById(req.params.id, populate);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Wholesale order not found' });
  }
  res.status(200).json({ success: true, data: order });
});

// Create a new wholesale order
exports.createWholesaleOrder = asyncHandler(async (req, res, next) => {
  const order = await wholesaleOrderService.createWholesaleOrder(req.body);
  res.status(201).json({ success: true, data: order });
});

// Update a wholesale order (PUT)
exports.updateWholesaleOrder = asyncHandler(async (req, res, next) => {
  const order = await wholesaleOrderService.updateWholesaleOrder(req.params.id, req.body);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Wholesale order not found' });
  }
  res.status(200).json({ success: true, data: order });
});

// Delete a wholesale order
exports.deleteWholesaleOrder = asyncHandler(async (req, res, next) => {
  const order = await wholesaleOrderService.deleteWholesaleOrder(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Wholesale order not found' });
  }
  res.status(200).json({ success: true, data: {} });
});

// Search wholesale orders
exports.searchWholesaleOrders = asyncHandler(async (req, res, next) => {
  const { wholeSalerName, wholeSalerLocation, wholeSalerEmail, productId, ...paginationQuery } = req.query;
  const populate = req.query.populate === 'true';
  const paginationParams = getPaginationParams(paginationQuery, 'wholeSalerName', 'asc');

  let queryCriteria = {};
  if (wholeSalerName) queryCriteria.wholeSalerName = { $regex: wholeSalerName, $options: 'i' };
  if (wholeSalerLocation) queryCriteria.wholeSalerLocation = { $regex: wholeSalerLocation, $options: 'i' };
  if (wholeSalerEmail) queryCriteria.wholeSalerEmail = { $regex: wholeSalerEmail, $options: 'i' };
  if (productId) queryCriteria.wholeSalerProducts = productId; // Search if order contains specific product ID

  const { orders, totalMatchingOrders } = await wholesaleOrderService.searchWholesaleOrders(queryCriteria, paginationParams, populate);

  res.status(200).json({
    success: true,
    total: totalMatchingOrders,
    page: paginationParams.page,
    limit: paginationParams.limit,
    totalPages: Math.ceil(totalMatchingOrders / paginationParams.limit),
    count: orders.length,
    data: orders
  });
});

// HEAD request for all wholesale orders
exports.headWholesaleOrders = asyncHandler(async (req, res, next) => {
  const count = await wholesaleOrderService.getWholesaleOrdersCount();
  res.set('X-Total-Count', count.toString());
  res.set('X-Resource-Type', 'WholesaleOrders');
  res.status(200).end();
});

// OPTIONS request for wholesale orders collection
exports.getWholesaleOrderOptions = (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS, PATCH');
  res.status(200).end();
};

// HEAD request for single wholesale order
exports.headWholesaleOrder = asyncHandler(async (req, res, next) => {
  const orderMeta = await wholesaleOrderService.getWholesaleOrderMetadata(req.params.id);
  if (!orderMeta) {
    return res.status(404).end();
  }
  res.set('X-Resource-Type', 'WholesaleOrder');
  // Cannot set Last-Modified as no timestamp fields in schema
  res.status(200).end();
});

// OPTIONS request for single wholesale order
exports.getWholesaleOrderIdOptions = (req, res) => {
  res.set('Allow', 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS');
  res.status(200).end();
};

// PATCH a wholesale order (partial update)
// Example: Add a product to the order
exports.addProductToOrder = asyncHandler(async (req, res, next) => {
    const { productId } = req.body;
    if (!productId) {
        return res.status(400).json({ success: false, error: 'productId is required in the request body.' });
    }
    const updateData = { $addToSet: { wholeSalerProducts: productId } };
    const order = await wholesaleOrderService.patchWholesaleOrder(req.params.id, updateData);
    if (!order) {
        return res.status(404).json({ success: false, error: 'Wholesale order not found' });
    }
    res.status(200).json({ success: true, data: order });
});

// Example: Remove a product from the order
exports.removeProductFromOrder = asyncHandler(async (req, res, next) => {
    const { productId } = req.body;
     if (!productId) {
        return res.status(400).json({ success: false, error: 'productId is required in the request body.' });
    }
    const updateData = { $pull: { wholeSalerProducts: productId } };
    const order = await wholesaleOrderService.patchWholesaleOrder(req.params.id, updateData);
     if (!order) {
        return res.status(404).json({ success: false, error: 'Wholesale order not found' });
    }
    res.status(200).json({ success: true, data: order });
});

// Generic PATCH for other fields (use with caution for arrays)
exports.patchWholesaleOrder = asyncHandler(async (req, res, next) => {
    // Exclude array modifications from generic patch unless specifically handled
    if (req.body.wholeSalerProducts) {
        return res.status(400).json({ success: false, error: 'Use specific endpoints to modify products list.' });
    }
    const order = await wholesaleOrderService.patchWholesaleOrder(req.params.id, req.body);
    if (!order) {
        return res.status(404).json({ success: false, error: 'Wholesale order not found' });
    }
    res.status(200).json({ success: true, data: order });
});
