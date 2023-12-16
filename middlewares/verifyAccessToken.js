const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {

    //get token
    const token = req?.headers?.authorization?.split(' ')[1];

    //if token not found
    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    //verify token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid access token' });
        }

        req.userId = decoded.userId;

        //continue to next route
        next();

    });

}

module.exports = verifyAccessToken;