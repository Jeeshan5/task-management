const jwt = require('jsonwebtoken');
const User = require("../models/User");

// Middleware to protect routes (authenticated users only)
const protect = async (req, res, next) => {
    try {
        let token;

        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            req.user = user;
            next();
        } else {
            return res.status(401).json({ message: 'Token failed' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(401).json({ message: 'Token invalid or expired' });
    }
};

// Middleware for admin-only routes
const adminonly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied, admin only' });
    }
};

module.exports = { protect, adminonly };
