// Placeholder for security-related services (e.g., permissions, encryption) 

// Import necessary models (e.g., User, Admin, Employee) and utilities
const Admin = require('../models/admin'); // Assuming Admin is the primary login model for now
const { comparePassword, hashPassword } = require('../utils/security');
const jwt = require('jsonwebtoken'); // Use the installed package

/**
 * Authenticates a user (Admin in this case) based on email and password.
 * @param {string} email - User's email.
 * @param {string} password - User's plain text password.
 * @returns {Promise<object|null>} The user object (without password) if authentication is successful, null otherwise.
 */
const authenticateUser = async (email, password) => {
    console.log(`Attempting to authenticate admin ${email}`);
    if (!email || !password) {
        return null;
    }

    // Find user by email, explicitly selecting the password field which is select: false in the model
    const user = await Admin.findOne({ email }).select('+password');

    if (!user) {
        console.log(`Authentication failed: Admin not found for email ${email}`);
        return null;
    }

    // Compare passwords
    const isMatch = await comparePassword(password, user.password);

    if (isMatch) {
       // Remove password before returning user object
       const userObject = user.toObject();
       delete userObject.password;
       console.log(`Authentication successful for ${email}`);
       return userObject;
    } else {
        console.log(`Authentication failed: Incorrect password for email ${email}`);
        return null;
    }
};

/**
 * Generates a JWT token for a user.
 * @param {object} user - The user object (must include _id).
 * @returns {string} The generated JWT token.
 */
const generateToken = (user) => {
    if (!user || !user._id) {
        throw new Error('User object with _id is required to generate token.');
    }
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables.');
    }

    // Create payload - include minimal necessary info (e.g., ID, maybe role)
    const payload = { id: user._id };
    // If you add roles to your Admin model, include it: const payload = { id: user._id, role: user.role };

    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }; // Use env variable or default

    console.log(`Generating token for user ${user._id} with expiry ${options.expiresIn}`);
    return jwt.sign(payload, secret, options);
};

/**
 * Verifies a JWT token.
 * @param {string} token - The JWT token to verify.
 * @returns {Promise<object|null>} The decoded payload if valid, null otherwise.
 */
const verifyToken = async (token) => {
    if (!token) return null;
    if (!process.env.JWT_SECRET) {
        console.error('JWT Verification Error: JWT_SECRET is not defined.');
        return null;
    }
    console.log(`Verifying token ${token.substring(0, 10)}...`);
    try {
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);
        return decoded; // Contains the payload (e.g., { id: userId, iat: ..., exp: ... })
    } catch (error) {
        console.error('JWT Verification Error:', error.message);
        return null;
    }
};

/**
 * Checks if a user has the required role(s) for an action.
 * @param {string} userId - The ID of the user.
 * @param {string|Array<string>} requiredRoles - The role or roles required.
 * @returns {Promise<boolean>} True if the user has at least one of the required roles.
 */
const checkUserRole = async (userId, requiredRoles) => {
    console.log(`Checking roles for user ${userId}. Required: ${requiredRoles}`);
    // Logic:
    // 1. Find user by ID (e.g., const user = await Admin.findById(userId);)
    // 2. Compare user.role against requiredRoles (ensure requiredRoles is an array)
    // const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    // return user && user.role && roles.includes(user.role);
    return true; // Placeholder - Implement actual role checking based on your schema
};

// Add more security service functions as needed...
// - Password reset logic
// - Role management
// - Permission checks

module.exports = {
    authenticateUser,
    generateToken,
    verifyToken,
    checkUserRole,
    // hashPassword is in utils/security, not needed here
}; 