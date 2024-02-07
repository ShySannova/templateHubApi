const jwt = require('jsonwebtoken');
const User = require('../model/User');


const verifyRefreshToken = async (req, res, next) => {
    try {
        // Get refresh token
        const refreshToken = req?.cookies?.refreshToken;

        // If token not found
        if (!refreshToken) {
            res.clearCookie('accessToken', { httpOnly: true, sameSite: 'None', secure: true });
            return res.status(401).json({ success: false, message: 'Refresh token is missing' });
        }

        // Verify token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const { email } = decoded;

        const user = await User.findOne({ email });
        const foundToken = user?.refreshToken.find(rt => rt.token === refreshToken);

        if (!user || !foundToken) {
            res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
            res.clearCookie('accessToken', { httpOnly: true, sameSite: 'None', secure: true });
            return res.status(403).json({ success: false, message: 'Invalid user or refresh token' });
        }


        // Continue to the next route
        next();

    } catch (error) {
        console.error('Error during refresh token verification:', error);
        return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
};


module.exports = verifyRefreshToken;