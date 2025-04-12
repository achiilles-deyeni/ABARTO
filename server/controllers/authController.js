const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new Admin
exports.registerAdmin = async (req, res) => {
    const { firstName, lastName, email, password, DOB, phoneNumber, salary, portfolio } = req.body;

    // Basic Validation
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide firstName, lastName, email, and password.' });
    }

    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({ success: false, message: 'Admin with this email already exists.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin
        const newAdmin = new Admin({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            DOB,
            phoneNumber,
            salary,
            portfolio,
            dateEmployed: Date.now() // Set employment date
        });

        const savedAdmin = await newAdmin.save();

        // Don't send password back, even hashed
        const adminData = savedAdmin.toObject();
        delete adminData.password;

        res.status(201).json({ success: true, message: 'Admin registered successfully.', data: adminData });

    } catch (error) {
        console.error('Admin registration error:', error);
         if (error.name === 'ValidationError') {
            res.status(400).json({ success: false, error: error.message });
        } else {
            res.status(500).json({ success: false, error: 'Server error during admin registration.' });
        }
    }
};

// Login Admin
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    try {
        // Find admin by email, explicitly select password (since it's select: false in schema)
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' }); // Use 401 Unauthorized
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' }); // Use 401 Unauthorized
        }

        // Passwords match, create JWT
        const payload = {
            id: admin._id,
            email: admin.email,
            // Add other relevant info if needed (e.g., role, name), but keep payload small
        };

        // Sign the token
        // IMPORTANT: Replace 'YOUR_JWT_SECRET' with an actual secret stored securely (e.g., in .env)
        const secret = process.env.JWT_SECRET || 'YOUR_JWT_SECRET_REPLACE_ME'; 
        const options = {
            expiresIn: process.env.JWT_EXPIRE || '1h' // Token expiration time (e.g., 1 hour)
        };

        const token = jwt.sign(payload, secret, options);
        
        // Optionally: Send admin data without password
        const adminData = admin.toObject();
        delete adminData.password;

        res.status(200).json({
            success: true,
            message: 'Login successful.',
            token: token,
            admin: adminData // Optionally return admin data
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ success: false, error: 'Server error during admin login.' });
    }
}; 