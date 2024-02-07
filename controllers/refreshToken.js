const jwt = require("jsonwebtoken");
const User = require("../model/User");


const refreshToken = async (req, res) => {

    try {
        const cookies = req.cookies;
        if (!cookies?.refreshToken) {
            return res.sendStatus(401);
        }

        const refreshToken = cookies.refreshToken;

        res.clearCookie('refreshToken', { httpOnly: true, sameSite: "None", secure: true });

        const foundUser = await User.findOne({ 'refreshToken.token': refreshToken });

        if (!foundUser) {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
                if (err) return res.sendStatus(403);
                const hackedUser = await User.findOne({ email: decoded.email }).exec();
                hackedUser.refreshToken = [];
                const result = await hackedUser.save()
            })
            return res.sendStatus(403);
        }

        const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt.token !== refreshToken);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err || foundUser.email !== decoded.email) {
                foundUser.refreshToken = newRefreshTokenArray;
                await foundUser.save();
                return res.sendStatus(403);
            }

            const roles = Object.values(foundUser.roles).filter(Boolean)
            const newAccessToken = jwt.sign({ email: decoded.email, roles }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: `${process.env.ACCESS_TOKEN_TIME_VALID}m`,
            });

            const newRefreshToken = {
                token: jwt.sign({ email: decoded.email }, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: `${process.env.REFRESH_TOKEN_TIME_VALID}m`
                }),
                expiresAt: new Date(Date.now() + eval(process.env.REFRESH_TOKEN_MAXAGE)),
            };

            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            await foundUser.save();

            const { _id, name, email } = foundUser;

            res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: eval(process.env.ACCESS_TOKEN_MAXAGE) });
            res.cookie('refreshToken', newRefreshToken.token, { httpOnly: true, secure: true, sameSite: 'None', maxAge: eval(process.env.REFRESH_TOKEN_MAXAGE) });

            res.status(200).json({
                message: "Token regenerated",
                userInfo: { _id, name, email, roles: Object.keys(foundUser.roles).filter(key => foundUser.roles[key] !== undefined) }
            });
        });
    } catch (error) {
        console.error("Error refreshing token", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = refreshToken;