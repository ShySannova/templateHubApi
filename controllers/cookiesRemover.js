const User = require("../model/User");

const cookiesRemover = async (req, res) => {

    try {
        const cookies = req.cookies;
        const refreshToken = cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(200).json({ message: "no cookies" });
        }
        // Is refreshToken in db?
        const foundUser = await User.findOne({ 'refreshToken.token': refreshToken }).exec();

        if (foundUser) {
            // Delete refreshToken in db
            foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt.token !== refreshToken);
            await foundUser.save();
        }

        // Clear cookies on the client side
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
        res.clearCookie('accessToken', { httpOnly: true, sameSite: 'None', secure: true });

        res.status(200).json({ message: "cookies successfully removed" });
    } catch (error) {
        console.error("Error removing cookies:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



module.exports = cookiesRemover;

