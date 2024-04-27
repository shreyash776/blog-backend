const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('Authenticating', secretKey);

    jwt.verify(token,secretKey, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = decoded; // Attach decoded user object to the request for further use
        next();
    });
}

module.exports = authenticateToken;
