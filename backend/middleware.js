const jwt = require('jsonwebtoken');
const {JWT_SECRET} = './config';

const authMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;
    if(!authorization && !authorization.startWith('Bearer')) {
        return res.status(443).json({
            message: 'Authorization header not found!'
        });
    }
    const token = authorization.aplit(' ')[1];

    try {
        const userId = jwt.verify(token, JWT_SECRET);
        req.userId = userId;
        next();
    } catch(err) {
        return res.status(403).json({
            message: 'Error in decoding authorization token!'
        });
    }
    
}

module.exports = {
    authMiddleware
}