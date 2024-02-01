const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {
    try {
        const refreshToken = req?.cookies?.refreshToken;
        const accessToken = req?.cookies?.accessToken;

        // If no refresh token
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'Refresh token is missing' });
        }

        // If token not found
        if (!accessToken) {
            return res.status(401).json({ success: false, message: 'Access token is missing' });
        }

        // Verify token
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: 'Invalid access token' });
            }
            // req.userId = decoded.userId;
            // Continue to the next route
            next();
        });
    } catch (error) {
        console.error('Error during access token verification:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


module.exports = verifyAccessToken;