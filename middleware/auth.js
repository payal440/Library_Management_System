const jwt = require('jsonwebtoken');
const User = require('../model/user');

const userAuth = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Extract token after "Bearer "

        console.log("=== auth middleware ===");
        console.log("Auth Header:", authHeader);
        console.log("Token:", token);

        if (!token) {
            console.log("No token provided");
            return res.status(401).json({ message: 'Token required' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        console.log("Decoded token:", decoded);

        // Get user from database
        console.log("User found:", user);

        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach user to request object
        req.user = user;
        console.log("User attached to request:", req.user);
        next();
    } catch (err) {
        console.error("Auth middleware error:", err.message);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = userAuth;