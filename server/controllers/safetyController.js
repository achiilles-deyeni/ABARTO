const SafetyEquipment = require("../models/safetyEquipment");

// Get all safety equipment items
exports.getAllSafetyItems = async (req, res) => {
  try {
    // Add sorting and pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort || "nextInspectionDate";
    const skip = (page - 1) * limit;

    const items = await SafetyEquipment.find()
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await SafetyEquipment.countDocuments();

    res.status(200).json({
      success: true,
      count: items.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: items,
    });
  } catch (error) {
    console.error("Error fetching safety equipment:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching safety equipment",
    });
  }
};

// Get safety equipment item by ID
exports.getSafetyItemById = async (req, res) => {
  try {
    const item = await SafetyEquipment.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, error: "Safety equipment not found" });
    }

    // Add warning if inspection is due soon (within 14 days)
    const today = new Date();
    const nextInspection = new Date(item.nextInspectionDate);
    const daysUntilInspection = Math.ceil(
      (nextInspection - today) / (1000 * 60 * 60 * 24)
    );

    let warning = null;
    if (daysUntilInspection < 0) {
      warning = "OVERDUE: Inspection past due date";
    } else if (daysUntilInspection < 14) {
      warning = `ATTENTION: Inspection due soon (${daysUntilInspection} days)`;
    }

    res.status(200).json({
      success: true,
      data: item,
      maintenance: {
        daysUntilInspection,
        warning,
      },
    });
  } catch (error) {
    console.error("Error fetching safety equipment by ID:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, error: "Invalid ID format" });
    }
    res.status(500).json({
      success: false,
      error: "Server error fetching safety equipment",
    });
  }
};

// Create new safety equipment item
exports.createSafetyItem = async (req, res) => {
  try {
    const {
      equipmentName,
      equipmentType,
      manufacturer,
      modelNumber,
      serialNumber,
      purchaseDate,
      warrantyExpirationDate,
      lastInspectionDate,
      nextInspectionDate,
      maintenanceInterval,
      lastMaintenanceDate,
      status,
      location,
      responsiblePerson,
      certificationRequired,
      certificationExpiryDate,
      maintenanceHistory,
      attachments,
    } = req.body;

    if (!equipmentName || !nextInspectionDate || !status) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: equipmentName, nextInspectionDate, status",
      });
    }

    const newItem = new SafetyEquipment({
      equipmentName,
      equipmentType,
      manufacturer,
      modelNumber,
      serialNumber,
      purchaseDate,
      warrantyExpirationDate,
      lastInspectionDate: lastInspectionDate || null,
      nextInspectionDate,
      maintenanceInterval, // in days
      lastMaintenanceDate,
      status,
      location,
      responsiblePerson,
      certificationRequired,
      certificationExpiryDate,
      maintenanceHistory: maintenanceHistory || [],
      attachments: attachments || [],
    });

    const savedItem = await newItem.save();

    res.status(201).json({ success: true, data: savedItem });
  } catch (error) {
    console.error("Error creating safety equipment:", error);
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(500).json({
        success: false,
        error: "Server error creating safety equipment",
      });
    }
  }
};

// Update safety equipment item (PUT - replace)
exports.updateSafetyItem = async (req, res) => {
  try {
    const item = await SafetyEquipment.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, error: "Safety equipment not found" });
    }

    const { equipmentName, nextInspectionDate, status } = req.body;
    if (!equipmentName || !nextInspectionDate || !status) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for update",
      });
    }

    // Remove _id if present to prevent errors
    if (req.body._id) delete req.body._id;

    const updatedItem = await SafetyEquipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    console.error("Error updating safety equipment (PUT):", error);
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else if (error.name === "CastError") {
      res.status(400).json({ success: false, error: "Invalid ID format" });
    } else {
      res.status(500).json({
        success: false,
        error: "Server error updating safety equipment",
      });
    }
  }
};

// Patch safety equipment item (PATCH - partial update)
exports.patchSafetyItem = async (req, res) => {
  try {
    // Remove _id if present to prevent errors
    if (req.body._id) delete req.body._id;

    const item = await SafetyEquipment.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, error: "Safety equipment not found" });
    }

    // Add to maintenance history if recording an inspection or maintenance
    if (req.body.lastInspectionDate || req.body.lastMaintenanceDate) {
      const historyEntry = {
        date: new Date(),
        type: req.body.lastInspectionDate ? "inspection" : "maintenance",
        details: req.body.maintenanceDetails || "Routine check",
        performedBy: req.body.performedBy || "Staff member",
      };

      // Use $push to add to the maintenance history array
      req.body.maintenanceHistory = {
        $push: { maintenanceHistory: historyEntry },
      };

      // If doing an inspection, update the next inspection date
      if (req.body.lastInspectionDate && item.maintenanceInterval) {
        const nextDate = new Date(req.body.lastInspectionDate);
        nextDate.setDate(nextDate.getDate() + item.maintenanceInterval);
        req.body.nextInspectionDate = nextDate;
      }
    }

    const updatedItem = await SafetyEquipment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    console.error("Error patching safety equipment:", error);
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else if (error.name === "CastError") {
      res.status(400).json({ success: false, error: "Invalid ID format" });
    } else {
      res.status(500).json({
        success: false,
        error: "Server error patching safety equipment",
      });
    }
  }
};

// Delete safety equipment item
exports.deleteSafetyItem = async (req, res) => {
  try {
    const item = await SafetyEquipment.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, error: "Safety equipment not found" });
    }

    // Check if equipment is critical before deletion
    if (item.equipmentType === "critical") {
      return res.status(403).json({
        success: false,
        error: "Cannot delete critical safety equipment. Archive it instead.",
      });
    }

    await SafetyEquipment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Safety equipment deleted successfully",
      data: {},
    });
  } catch (error) {
    console.error("Error deleting safety equipment:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, error: "Invalid ID format" });
    }
    res.status(500).json({
      success: false,
      error: "Server error deleting safety equipment",
    });
  }
};

// Search safety equipment items with enhanced filters
exports.searchSafetyItems = async (req, res) => {
  try {
    const {
      equipmentName,
      equipmentType,
      status,
      location,
      inspectionDueBefore,
      inspectionDueAfter,
      maintenanceDueBefore,
      certificationExpiryBefore,
      responsiblePerson,
    } = req.query;

    let query = {};

    // Text-based filters with case-insensitive regex
    if (equipmentName)
      query.equipmentName = { $regex: equipmentName, $options: "i" };
    if (equipmentType) query.equipmentType = equipmentType;
    if (status) query.status = status;
    if (location) query.location = { $regex: location, $options: "i" };
    if (responsiblePerson)
      query.responsiblePerson = { $regex: responsiblePerson, $options: "i" };

    // Date-based filters
    if (inspectionDueBefore) {
      query.nextInspectionDate = query.nextInspectionDate || {};
      query.nextInspectionDate.$lte = new Date(inspectionDueBefore);
    }

    if (inspectionDueAfter) {
      query.nextInspectionDate = query.nextInspectionDate || {};
      query.nextInspectionDate.$gte = new Date(inspectionDueAfter);
    }

    if (maintenanceDueBefore) {
      // Calculate the due date based on last maintenance and interval
      const dueDateQuery = new Date(maintenanceDueBefore);
      query.$expr = {
        $lte: [
          {
            $add: [
              "$lastMaintenanceDate",
              { $multiply: ["$maintenanceInterval", 24 * 60 * 60 * 1000] },
            ],
          },
          dueDateQuery,
        ],
      };
    }

    if (certificationExpiryBefore) {
      query.certificationExpiryDate = {
        $lte: new Date(certificationExpiryBefore),
      };
    }

    // Sorting and pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort || "nextInspectionDate";
    const skip = (page - 1) * limit;

    const items = await SafetyEquipment.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await SafetyEquipment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: items.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: items,
    });
  } catch (error) {
    console.error("Error searching safety equipment:", error);
    res.status(500).json({
      success: false,
      error: "Server error searching safety equipment",
    });
  }
};

// Get equipment items due for inspection
exports.getEquipmentDueForInspection = async (req, res) => {
  try {
    const daysThreshold = parseInt(req.query.days, 10) || 30;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysThreshold);

    const items = await SafetyEquipment.find({
      nextInspectionDate: { $lte: futureDate },
      status: { $ne: "Out of Service" },
    }).sort({ nextInspectionDate: 1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("Error fetching equipment due for inspection:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Record maintenance or inspection
exports.recordMaintenance = async (req, res) => {
  try {
    const {
      maintenanceType,
      maintenanceDate,
      performedBy,
      details,
      result,
      nextScheduledDate,
    } = req.body;

    if (!maintenanceType || !maintenanceDate || !performedBy) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: maintenanceType, maintenanceDate, performedBy",
      });
    }

    const item = await SafetyEquipment.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, error: "Safety equipment not found" });
    }

    // Create maintenance history entry
    const historyEntry = {
      date: new Date(maintenanceDate),
      type: maintenanceType,
      performedBy,
      details,
      result: result || "Completed",
    };

    // Update fields based on maintenance type
    const updateData = {
      $push: { maintenanceHistory: historyEntry },
    };

    if (maintenanceType === "inspection") {
      updateData.lastInspectionDate = new Date(maintenanceDate);
      updateData.nextInspectionDate = nextScheduledDate
        ? new Date(nextScheduledDate)
        : new Date(
            new Date(maintenanceDate).setDate(
              new Date(maintenanceDate).getDate() +
                (item.maintenanceInterval || 90)
            )
          );

      // Update status based on inspection result
      if (result === "Failed") {
        updateData.status = "Needs Repair";
      } else if (result === "Passed") {
        updateData.status = "Operational";
      }
    } else if (maintenanceType === "maintenance") {
      updateData.lastMaintenanceDate = new Date(maintenanceDate);

      // Update status if maintenance resolves issues
      if (item.status === "Needs Repair" && result === "Completed") {
        updateData.status = "Operational";
      }
    } else if (maintenanceType === "certification") {
      updateData.certificationExpiryDate = nextScheduledDate
        ? new Date(nextScheduledDate)
        : null;
    }

    const updatedItem = await SafetyEquipment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error recording maintenance:", error);
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, error: error.message });
    } else if (error.name === "CastError") {
      res.status(400).json({ success: false, error: "Invalid ID format" });
    } else {
      res.status(500).json({ success: false, error: "Server error" });
    }
  }
};

// Generate maintenance report
exports.generateMaintenanceReport = async (req, res) => {
  try {
    const { startDate, endDate, equipmentType, location } = req.query;

    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
    }

    // Build query for maintenance history
    let query = {
      "maintenanceHistory.date": dateFilter,
    };

    if (equipmentType) query.equipmentType = equipmentType;
    if (location) query.location = location;

    const items = await SafetyEquipment.find(query);

    // Process the data to extract maintenance events
    const report = {
      totalEquipment: items.length,
      maintenanceEvents: 0,
      inspectionEvents: 0,
      certificationEvents: 0,
      equipmentByStatus: {},
      maintenanceByMonth: {},
      equipmentRequiringAttention: [],
    };

    items.forEach((item) => {
      // Count status occurrences
      report.equipmentByStatus[item.status] =
        (report.equipmentByStatus[item.status] || 0) + 1;

      // Identify equipment requiring attention
      const today = new Date();
      if (new Date(item.nextInspectionDate) < today) {
        report.equipmentRequiringAttention.push({
          id: item._id,
          name: item.equipmentName,
          status: item.status,
          nextInspectionDate: item.nextInspectionDate,
          daysOverdue: Math.ceil(
            (today - new Date(item.nextInspectionDate)) / (1000 * 60 * 60 * 24)
          ),
        });
      }

      // Count and categorize maintenance events
      item.maintenanceHistory.forEach((event) => {
        if (!dateFilter.$gte || new Date(event.date) >= dateFilter.$gte) {
          if (!dateFilter.$lte || new Date(event.date) <= dateFilter.$lte) {
            // Count by type
            if (event.type === "inspection") report.inspectionEvents++;
            else if (event.type === "maintenance") report.maintenanceEvents++;
            else if (event.type === "certification")
              report.certificationEvents++;

            // Group by month for trend analysis
            const monthYear = `${
              new Date(event.date).getMonth() + 1
            }/${new Date(event.date).getFullYear()}`;
            if (!report.maintenanceByMonth[monthYear]) {
              report.maintenanceByMonth[monthYear] = {
                total: 0,
                inspection: 0,
                maintenance: 0,
                certification: 0,
              };
            }
            report.maintenanceByMonth[monthYear].total++;
            report.maintenanceByMonth[monthYear][event.type]++;
          }
        }
      });
    });

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Error generating maintenance report:", error);
    res
      .status(500)
      .json({ success: false, error: "Server error generating report" });
  }
};

// HEAD request for all safety equipment items
exports.headSafetyItems = async (req, res) => {
  try {
    const count = await SafetyEquipment.countDocuments();
    res.set("X-Total-Count", count.toString());
    res.set("X-Resource-Type", "SafetyEquipment");
    res.status(200).end();
  } catch (error) {
    console.error("Error handling HEAD for safety equipment:", error);
    res.status(500).end();
  }
};

// OPTIONS request for safety equipment collection
exports.getSafetyOptions = (req, res) => {
  res.set("Allow", "GET, POST, HEAD, OPTIONS");
  res.status(200).end();
};

// HEAD request for single safety equipment item
exports.headSafetyItem = async (req, res) => {
  try {
    const item = await SafetyEquipment.findById(req.params.id).select(
      "updatedAt createdAt lastInspectionDate"
    );
    if (!item) {
      return res.status(404).end();
    }
    res.set("X-Resource-Type", "SafetyEquipment");
    // Use updatedAt, createdAt, or lastInspectionDate for Last-Modified header
    const lastModified =
      item.updatedAt || item.createdAt || item.lastInspectionDate;
    if (lastModified) {
      res.set("Last-Modified", lastModified.toUTCString());
    }
    res.status(200).end();
  } catch (error) {
    console.error("Error handling HEAD for single safety equipment:", error);
    if (error.name === "CastError") {
      return res.status(400).end();
    }
    res.status(500).end();
  }
};

// OPTIONS request for single safety equipment item
exports.getSafetyIdOptions = (req, res) => {
  res.set("Allow", "GET, PUT, DELETE, PATCH, HEAD, OPTIONS");
  res.status(200).end();
};
