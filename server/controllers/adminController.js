const adminService = require('../services/adminService');
const { getPaginationParams } = require('../utils/pagination');
const asyncHandler = require('../utils/asyncHandler');

// Get all admins
exports.getAllAdmins = asyncHandler(async (req, res, next) => {
  const paginationParams = getPaginationParams(req.query, 'lastName', 'asc'); // Default sort for admins
  const { admins, totalAdmins } = await adminService.getAllAdmins(paginationParams);

  res.status(200).json({
    success: true,
    total: totalAdmins,
    page: paginationParams.page,
    limit: paginationParams.limit,
    totalPages: Math.ceil(totalAdmins / paginationParams.limit),
    count: admins.length,
    data: admins
  });
});

// Get a single admin by ID
exports.getAdminById = asyncHandler(async (req, res, next) => {
  const admin = await adminService.getAdminById(req.params.id);
  if (!admin) {
    return res.status(404).json({ success: false, error: 'Admin not found' });
  }
  res.status(200).json({ success: true, data: admin });
});

// Create a new admin
exports.createAdmin = asyncHandler(async (req, res, next) => {
  // Add validation here or via middleware later
  const admin = await adminService.createAdmin(req.body);
  res.status(201).json({ success: true, data: admin });
});

// Update an admin (PUT - full update)
exports.updateAdmin = asyncHandler(async (req, res, next) => {
    // Ensure password is not accidentally wiped if not provided
    // If password field is optional on PUT, logic might need adjustment
  const admin = await adminService.updateAdmin(req.params.id, req.body);
  if (!admin) {
    return res.status(404).json({ success: false, error: 'Admin not found' });
  }
  res.status(200).json({ success: true, data: admin });
});

// Delete an admin
exports.deleteAdmin = asyncHandler(async (req, res, next) => {
  const admin = await adminService.deleteAdmin(req.params.id);
  if (!admin) {
    return res.status(404).json({ success: false, error: 'Admin not found' });
  }
  res.status(200).json({ success: true, data: {} });
});

// Search admins
exports.searchAdmins = asyncHandler(async (req, res, next) => {
  // Define searchable fields for admins
  const { firstName, lastName, email, portfolio, ...paginationQuery } = req.query;
  const paginationParams = getPaginationParams(paginationQuery, 'lastName', 'asc');

  // Build search criteria
  let queryCriteria = {};
  if (firstName) queryCriteria.firstName = { $regex: firstName, $options: 'i' };
  if (lastName) queryCriteria.lastName = { $regex: lastName, $options: 'i' };
  if (email) queryCriteria.email = { $regex: email, $options: 'i' };
  if (portfolio) queryCriteria.portfolio = { $regex: portfolio, $options: 'i' };

  const { admins, totalMatchingAdmins } = await adminService.searchAdmins(queryCriteria, paginationParams);

  res.status(200).json({
    success: true,
    total: totalMatchingAdmins,
    page: paginationParams.page,
    limit: paginationParams.limit,
    totalPages: Math.ceil(totalMatchingAdmins / paginationParams.limit),
    count: admins.length,
    data: admins
  });
});

// HEAD request for all admins
exports.headAdmins = asyncHandler(async (req, res, next) => {
  const count = await adminService.getAdminsCount();
  res.set('X-Total-Count', count.toString());
  res.set('X-Resource-Type', 'Admins');
  res.status(200).end();
});

// OPTIONS request for admins collection
exports.getAdminOptions = (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS, PATCH');
  res.status(200).end();
};

// HEAD request for single admin
exports.headAdmin = asyncHandler(async (req, res, next) => {
  const adminMeta = await adminService.getAdminMetadata(req.params.id);
  if (!adminMeta) {
    return res.status(404).end();
  }
  res.set('X-Resource-Type', 'Admin');
  const lastModified = adminMeta.updatedAt || adminMeta.dateEmployed;
  if(lastModified) {
      res.set('Last-Modified', new Date(lastModified).toUTCString());
  }
  res.status(200).end();
});

// OPTIONS request for single admin
exports.getAdminIdOptions = (req, res) => {
  res.set('Allow', 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS');
  res.status(200).end();
};

// PATCH an admin (partial update)
exports.patchAdmin = asyncHandler(async (req, res, next) => {
  const admin = await adminService.patchAdmin(req.params.id, req.body);
  if (!admin) {
    return res.status(404).json({ success: false, error: 'Admin not found' });
  }
  res.status(200).json({ success: true, data: admin });
});
