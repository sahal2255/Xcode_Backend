const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    const token = req.cookies.usertoken; 

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        req.user = decoded; 
        next(); 
    });
};

module.exports = userAuth;
