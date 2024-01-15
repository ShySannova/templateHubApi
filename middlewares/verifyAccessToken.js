const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {

    const refreshToken = req?.cookies?.refreshToken;
    const accessToken = req?.cookies?.accessToken;

    //if no refresh token
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is missing' })
    }

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