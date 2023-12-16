const jwt = require("jsonwebtoken");


const refreshToken = (req, res) => {
    // Generate a new access token
    const newAccessToken = jwt.sign({ userId: req.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

    res.json({ accessToken: newAccessToken });
}

module.exports = refreshToken;