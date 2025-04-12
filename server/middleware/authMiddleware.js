const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const secret = process.env.JWT_SECRET || 'YOUR_JWT_SECRET_REPLACE_ME'; // Use the same secret as in login
            const decoded = jwt.verify(token, secret);

            // Get user (admin) from the token payload (using the id)
            // Optionally exclude password even though schema tries to hide it
            req.admin = await Admin.findById(decoded.id).select('-password'); 

            if (!req.admin) {
                 // Handle case where admin linked to token no longer exists
                 return res.status(401).json({ success: false, message: 'Not authorized, admin not found' });
            }

            next(); // Proceed to the next middleware/route handler

        } catch (error) {
            console.error('Token verification failed:', error);
            // Handle different errors (expired, invalid signature)
            let message = 'Not authorized, token failed';
            if (error.name === 'JsonWebTokenError') {
                message = 'Not authorized, invalid token';
            }
            if (error.name === 'TokenExpiredError') {
                message = 'Not authorized, token expired';
            }
            return res.status(401).json({ success: false, message: message });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};

// Optional: Middleware for role-based access (if you add roles to Admin model)
// const authorize = (...roles) => {
//     return (req, res, next) => {
//         if (!req.admin || !roles.includes(req.admin.role)) { // Assuming role field exists
//              return res.status(403).json({ success: false, message: `Admin role ${req.admin?.role || 'unknown'} is not authorized to access this route`});
//         }
//         next();
//     };
// };

module.exports = { protect /*, authorize */ }; 