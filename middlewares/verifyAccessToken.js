const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {

    const accessToken = req?.cookies?.accessToken;

    //if token not found
    if (!accessToken) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    //verify token
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid access token' });
        }

        req.userId = decoded.userId;

        //continue to next route
        next();

    });

}

module.exports = verifyAccessToken;