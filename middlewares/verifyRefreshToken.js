const jwt = require('jsonwebtoken');
const User = require('../model/Users');


const verifyRefreshToken = async (req, res, next) => {

    //get refresh token
    const refreshToken = req?.cookies?.refreshToken;

    //if token not found
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is missing' });
    }

    //verify token
    try {

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        req.userId = decoded.userId;

        const user = await User.findById(req.userId);
        const foundToken = user?.refreshToken.find(rt => rt.token === refreshToken);

        if (!user || !foundToken) {
            return res.status(403).json({ message: 'Invalid user or refresh token' });
        }

        //continue to next route
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Invalid refresh token' })
    }


}

module.exports = verifyRefreshToken;