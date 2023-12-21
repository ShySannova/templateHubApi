const jwt = require("jsonwebtoken");
const User = require("../model/Users");


const refreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(401);

    const refreshToken = cookies?.refreshToken;

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: "None", secure: true, maxAge: 3 * 60 * 1000 })

    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403);
                const hackedUser = User.findOne({ username: decoded.username }).exec();
                hackedUser.refreshToken = [];
                const result = await hackedUser.save()
            }
        )
        res.sendStatus(403)
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken)

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await foundUser.save();
            }
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

            // Refresh token was still valid
            const newAccessToken = jwt.sign({ userId: foundUser._id }, process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "1m",
                });

            const newRefreshToken = jwt.sign({ userId: foundUser._id }, process.env.REFRESH_TOKEN_SECRET,
                {
                    expiresIn: '3m'
                }
            );
            // Saving refreshToken with current user
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await foundUser.save();

            // Creates Secure Cookie with refresh token
            res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 60 * 1000 });
            res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 3 * 60 * 1000 });

            res.status(200).json({
                message: "token regenerated",
            });

        }
    )

}

module.exports = refreshToken;