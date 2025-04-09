const express = require("express");
const router = express.Router();
const Admin = require("../../models/admin");

// route to add/register an administrator
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
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(402)
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
    res.status(201).json({
      success: true,
      message: "Administrator added successfully.",
      result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get all administrators
router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// route to update an administrator
router.patch("/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Administrator not found" });
    }
    admin.firstName = req.body.firstName;
    admin.lastName = req.body.lastName;
    admin.DOB = req.body.DOB;
    admin.phoneNumber = req.body.phoneNumber;
    admin.email = req.body.email;
    admin.salary = req.body.salary;
    admin.portfolio = req.body.portfolio;
    admin.dateEmployed = req.body.dateEmployed;
    await admin.save();
    res.json(admin);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Route to delete an administrator
router.delete("/:id", async (req, res) => {
  try {
    const admin = Admin.findById(req.params.id);
    if (!admin) {
      res.status(500).json({ message: "Administrator not found" });
    }
    await admin.remove();
    res.status(200).json({ message: "Administrator deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; // Exporting the router
