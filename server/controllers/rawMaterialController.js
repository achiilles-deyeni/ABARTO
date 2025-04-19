const rawMaterialService = require('../services/rawMaterialService');
const { getPaginationParams } = require('../utils/pagination');
const asyncHandler = require('../utils/asyncHandler');

// Get all rawMaterials
exports.getAllRawMaterials = asyncHandler(async (req, res, next) => {
  const paginationParams = getPaginationParams(req.query, 'Name', 'asc'); // Default sort by Name
  const { rawMaterials, totalRawMaterials } = await rawMaterialService.getAllRawMaterials(paginationParams);

  res.status(200).json({
    success: true,
    total: totalRawMaterials,
    page: paginationParams.page,
    limit: paginationParams.limit,
    totalPages: Math.ceil(totalRawMaterials / paginationParams.limit),
    count: rawMaterials.length,
    data: rawMaterials
  });
});

// Get a single rawMaterial by ID
exports.getRawMaterialById = asyncHandler(async (req, res, next) => {
  const rawMaterial = await rawMaterialService.getRawMaterialById(req.params.id);
  if (!rawMaterial) {
    return res.status(404).json({ success: false, error: 'Raw material not found' });
  }
  res.status(200).json({ success: true, data: rawMaterial });
});

// Create a new rawMaterial
exports.createRawMaterial = asyncHandler(async (req, res, next) => {
  const rawMaterial = await rawMaterialService.createRawMaterial(req.body);
  res.status(201).json({ success: true, data: rawMaterial });
});

// Update a rawMaterial (PUT)
exports.updateRawMaterial = asyncHandler(async (req, res, next) => {
  const rawMaterial = await rawMaterialService.updateRawMaterial(req.params.id, req.body);
  if (!rawMaterial) {
    return res.status(404).json({ success: false, error: 'Raw material not found' });
  }
  res.status(200).json({ success: true, data: rawMaterial });
});

// Delete a rawMaterial
exports.deleteRawMaterial = asyncHandler(async (req, res, next) => {
  const rawMaterial = await rawMaterialService.deleteRawMaterial(req.params.id);
  if (!rawMaterial) {
    return res.status(404).json({ success: false, error: 'Raw material not found' });
  }
  res.status(200).json({ success: true, data: {} });
});

// Search rawMaterials
exports.searchRawMaterials = asyncHandler(async (req, res, next) => {
  const { Name, Source, minQuantity, maxQuantity, startDate, endDate, ...paginationQuery } = req.query;
  const paginationParams = getPaginationParams(paginationQuery, 'Name', 'asc');

  let queryCriteria = {};
  if (Name) queryCriteria.Name = { $regex: Name, $options: 'i' };
  if (Source) queryCriteria.Source = { $regex: Source, $options: 'i' };
  if (minQuantity || maxQuantity) {
      queryCriteria.Quantity = {};
      if (minQuantity) queryCriteria.Quantity.$gte = parseInt(minQuantity, 10);
      if (maxQuantity) queryCriteria.Quantity.$lte = parseInt(maxQuantity, 10);
  }
   if (startDate || endDate) {
        queryCriteria.dateProvided = {};
        if (startDate) queryCriteria.dateProvided.$gte = new Date(startDate);
        if (endDate) queryCriteria.dateProvided.$lte = new Date(endDate);
    }
  // Add price range searching if needed (convert price field to Number in schema/service first)

  const { rawMaterials, totalMatchingRawMaterials } = await rawMaterialService.searchRawMaterials(queryCriteria, paginationParams);

  res.status(200).json({
    success: true,
    total: totalMatchingRawMaterials,
    page: paginationParams.page,
    limit: paginationParams.limit,
    totalPages: Math.ceil(totalMatchingRawMaterials / paginationParams.limit),
    count: rawMaterials.length,
    data: rawMaterials
  });
});

// HEAD request for all rawMaterials
exports.headRawMaterials = asyncHandler(async (req, res, next) => {
  const count = await rawMaterialService.getRawMaterialsCount();
  res.set('X-Total-Count', count.toString());
  res.set('X-Resource-Type', 'RawMaterials');
  res.status(200).end();
});

// OPTIONS request for rawMaterials collection
exports.getRawMaterialOptions = (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS, PATCH');
  res.status(200).end();
};

// HEAD request for single rawMaterial
exports.headRawMaterial = asyncHandler(async (req, res, next) => {
  const rawMaterialMeta = await rawMaterialService.getRawMaterialMetadata(req.params.id);
  if (!rawMaterialMeta) {
    return res.status(404).end();
  }
  res.set('X-Resource-Type', 'RawMaterial');
  const lastModified = rawMaterialMeta.dateProvided; // Use relevant date field
  if(lastModified) {
      res.set('Last-Modified', new Date(lastModified).toUTCString());
  }
  res.status(200).end();
});

// OPTIONS request for single rawMaterial
exports.getRawMaterialIdOptions = (req, res) => {
  res.set('Allow', 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS');
  res.status(200).end();
};

// PATCH a rawMaterial (partial update)
exports.patchRawMaterial = asyncHandler(async (req, res, next) => {
  const rawMaterial = await rawMaterialService.patchRawMaterial(req.params.id, req.body);
  if (!rawMaterial) {
    return res.status(404).json({ success: false, error: 'Raw material not found' });
  }
  res.status(200).json({ success: true, data: rawMaterial });
}); 