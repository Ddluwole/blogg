const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if(!token) {
        return res.status(401).send('Access denied. No token provided');
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch(error) {
        res.status(400).send('Invalid token.');
    }
};
module.exports = auth;
