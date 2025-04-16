const machineryPartService = require('../services/machineryPartService');
const { getPaginationParams } = require('../utils/pagination');
const asyncHandler = require('../utils/asyncHandler');

// Get all machinery parts
exports.getAllMachineryParts = asyncHandler(async (req, res, next) => {
  const paginationParams = getPaginationParams(req.query, 'name', 'asc'); // Default sort
  const populate = req.query.populate === 'true'; // Check if populate query param is set
  const { parts, totalParts } = await machineryPartService.getAllMachineryParts(paginationParams, populate);

  res.status(200).json({
    success: true,
    total: totalParts,
    page: paginationParams.page,
    limit: paginationParams.limit,
    totalPages: Math.ceil(totalParts / paginationParams.limit),
    count: parts.length,
    data: parts
  });
});

// Get a single machinery part by ID
exports.getMachineryPartById = asyncHandler(async (req, res, next) => {
  const populate = req.query.populate === 'true';
  const part = await machineryPartService.getMachineryPartById(req.params.id, populate);
  if (!part) {
    return res.status(404).json({ success: false, error: 'Machinery part not found' });
  }
  res.status(200).json({ success: true, data: part });
});

// Create a new machinery part
exports.createMachineryPart = asyncHandler(async (req, res, next) => {
  const part = await machineryPartService.createMachineryPart(req.body);
  res.status(201).json({ success: true, data: part });
});

// Update a machinery part (PUT)
exports.updateMachineryPart = asyncHandler(async (req, res, next) => {
  const part = await machineryPartService.updateMachineryPart(req.params.id, req.body);
  if (!part) {
    return res.status(404).json({ success: false, error: 'Machinery part not found' });
  }
  res.status(200).json({ success: true, data: part });
});

// Delete a machinery part
exports.deleteMachineryPart = asyncHandler(async (req, res, next) => {
  const part = await machineryPartService.deleteMachineryPart(req.params.id);
  if (!part) {
    return res.status(404).json({ success: false, error: 'Machinery part not found' });
  }
  res.status(200).json({ success: true, data: {} });
});

// Search machinery parts
exports.searchMachineryParts = asyncHandler(async (req, res, next) => {
  const { name, type, machineId, ...paginationQuery } = req.query;
  const populate = req.query.populate === 'true';
  const paginationParams = getPaginationParams(paginationQuery, 'name', 'asc');

  let queryCriteria = {};
  if (name) queryCriteria.name = { $regex: name, $options: 'i' };
  if (type) queryCriteria.type = { $regex: type, $options: 'i' };
  if (machineId) queryCriteria.machine = machineId; // Assuming machine is stored by ID
  // Add searches for quantity/price ranges if needed

  const { parts, totalMatchingParts } = await machineryPartService.searchMachineryParts(queryCriteria, paginationParams, populate);

  res.status(200).json({
    success: true,
    total: totalMatchingParts,
    page: paginationParams.page,
    limit: paginationParams.limit,
    totalPages: Math.ceil(totalMatchingParts / paginationParams.limit),
    count: parts.length,
    data: parts
  });
});

// HEAD request for all machinery parts
exports.headMachineryParts = asyncHandler(async (req, res, next) => {
  const count = await machineryPartService.getMachineryPartsCount();
  res.set('X-Total-Count', count.toString());
  res.set('X-Resource-Type', 'MachineryParts');
  res.status(200).end();
});

// OPTIONS request for machinery parts collection
exports.getMachineryPartOptions = (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS, PATCH');
  res.status(200).end();
};

// HEAD request for single machinery part
exports.headMachineryPart = asyncHandler(async (req, res, next) => {
  const partMeta = await machineryPartService.getMachineryPartMetadata(req.params.id);
  if (!partMeta) {
    return res.status(404).end();
  }
  res.set('X-Resource-Type', 'MachineryPart');
  // Cannot set Last-Modified as no timestamp fields in schema
  res.status(200).end();
});

// OPTIONS request for single machinery part
exports.getMachineryPartIdOptions = (req, res) => {
  res.set('Allow', 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS');
  res.status(200).end();
};

// PATCH a machinery part (partial update)
exports.patchMachineryPart = asyncHandler(async (req, res, next) => {
  const part = await machineryPartService.patchMachineryPart(req.params.id, req.body);
  if (!part) {
    return res.status(404).json({ success: false, error: 'Machinery part not found' });
  }
  res.status(200).json({ success: true, data: part });
});
