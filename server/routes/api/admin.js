const express = require("express");
const router = express.Router();
const Admin = require("../../models/admin");

// Route to add/register an administrator
router.post("/register-admin", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      DOB,
      phoneNumber,
      email,
      salary,
      portfolio,
      dateEmployed,
    } = req.body;

    // Input validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, and email are required!",
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(409) // Changed from 402 to 409 (Conflict)
        .json({ success: false, message: "Administrator already exists" });
    }

    const newAdmin = new Admin({
      firstName,
      lastName,
      DOB,
      phoneNumber,
      email,
      salary,
      portfolio,
      dateEmployed,
    });

    const result = await newAdmin.save();
    return res.status(201).json({
      success: true,
      message: "Administrator added successfully.",
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Route to get all administrators
router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find();
    return res.status(200).json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Route to get a specific administrator
router.get("/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Administrator not found",
      });
    }

    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Route to update an administrator
router.patch("/:id", async (req, res) => {
  try {
    // Using findByIdAndUpdate for better atomic updates
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        DOB: req.body.DOB,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        salary: req.body.salary,
        portfolio: req.body.portfolio,
        dateEmployed: req.body.dateEmployed,
      },
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Administrator not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Administrator updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Route to delete an administrator
router.delete("/:id", async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);

    if (!deletedAdmin) {
      return res.status(404).json({
        // Changed from 500 to 404
        success: false,
        message: "Administrator not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Administrator deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
module.exports = router;
