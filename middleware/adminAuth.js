const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    const token = req.cookies.admintoken; // Retrieve token from cookies

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        req.admin = decoded; // Store decoded admin details in the request object
        next(); // Proceed to the next middleware/route handler
    });
};

module.exports = adminAuth;
