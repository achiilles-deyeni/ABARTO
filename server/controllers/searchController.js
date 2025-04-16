const asyncHandler = require('../utils/asyncHandler');
const Product = require('../models/products');
const Employee = require('../models/employee');
const IndustrialSupply = require('../models/industrialSupply');
const RawMaterial = require('../models/rawMaterial');
const ChemicalCompound = require('../models/chemicalCompound');
const MachineryPart = require('../models/machineryPart');
const WholesaleOrder = require('../models/wholesaleOrder');
const SafetyEquipment = require('../models/safetyEquipment');
const Admin = require('../models/admin'); // Include Admin if needed

// @desc    Global search across multiple collections
// @route   GET /api/search
// @access  Private (requires authentication)
exports.globalSearch = asyncHandler(async (req, res, next) => {
    const { q, limit = 10, page = 1 } = req.query;

    if (!q) {
        return res.status(400).json({ success: false, error: 'Search query parameter "q" is required.' });
    }

    const searchTerm = { $regex: q, $options: 'i' }; // Case-insensitive regex search
    const limitNum = parseInt(limit, 10);
    const pageNum = parseInt(page, 10);
    const skip = (pageNum - 1) * limitNum;

    // Define fields to search for each model
    // Using $or to search across multiple fields within each model
    const searchPromises = [
        Product.find({
            $or: [
                { name: searchTerm },
                { description: searchTerm },
                { category: searchTerm },
                { sku: searchTerm }
            ]
        }).limit(limitNum).skip(skip).lean().then(docs => ({ type: 'Products', results: docs })),

        Employee.find({
            $or: [
                { firstName: searchTerm },
                { lastName: searchTerm },
                { email: searchTerm },
                { department: searchTerm },
                { position: searchTerm }
            ]
        }).limit(limitNum).skip(skip).lean().then(docs => ({ type: 'Employees', results: docs })),

        IndustrialSupply.find({
             $or: [
                { name: searchTerm },
                { supplier: searchTerm },
                { description: searchTerm },
                { category: searchTerm }
            ]
        }).limit(limitNum).skip(skip).lean().then(docs => ({ type: 'Industrial Supplies', results: docs })),

        RawMaterial.find({ // Uses PascalCase fields
             $or: [
                { Name: searchTerm },
                { Source: searchTerm }
            ]
        }).limit(limitNum).skip(skip).lean().then(docs => ({ type: 'Raw Materials', results: docs })),

        ChemicalCompound.find({
             $or: [
                { name: searchTerm },
                { molecularFormula: searchTerm },
                { color: searchTerm },
                { toxicity: searchTerm }
            ]
        }).limit(limitNum).skip(skip).lean().then(docs => ({ type: 'Chemicals', results: docs })),

        MachineryPart.find({
             $or: [
                { name: searchTerm },
                { type: searchTerm },
                { description: searchTerm }
            ]
        }).limit(limitNum).skip(skip).lean().then(docs => ({ type: 'Machinery Parts', results: docs })),

        WholesaleOrder.find({
            $or: [
                { wholeSalerName: searchTerm },
                { wholeSalerLocation: searchTerm },
                { wholeSalerContact: searchTerm },
                { wholeSalerEmail: searchTerm }
            ]
        }).limit(limitNum).skip(skip).lean().then(docs => ({ type: 'Wholesale Orders', results: docs })),

        SafetyEquipment.find({ // Uses PascalCase fields
             $or: [
                { EquipmentName: searchTerm },
                { EquipmentType: searchTerm },
                { EquipmentCondition: searchTerm },
                { EquipmentLocation: searchTerm }
            ]
        }).limit(limitNum).skip(skip).lean().then(docs => ({ type: 'Safety Equipment', results: docs })),

        Admin.find({ // Exclude sensitive fields like password
             $or: [
                { firstName: searchTerm },
                { lastName: searchTerm },
                { email: searchTerm }
             ]
        }).select('-password').limit(limitNum).skip(skip).lean().then(docs => ({ type: 'Admins', results: docs }))
    ];

    // Execute all searches in parallel
    const searchResults = await Promise.all(searchPromises);

    // Filter out empty results and structure the response
    const combinedResults = searchResults.filter(result => result.results.length > 0);

    // Basic pagination info (total counts across all types would require extra queries)
    const pagination = {
        page: pageNum,
        limit: limitNum,
        // Note: totalPages and totalCount for the global search would require
        // counting documents matching the query in each collection, which adds overhead.
        // For simplicity, we are returning counts per type in this basic implementation.
    };

    res.status(200).json({
        success: true,
        query: q,
        pagination,
        data: combinedResults
    });
});
