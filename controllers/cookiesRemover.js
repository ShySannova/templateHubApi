const User = require("../model/Users");

const cookiesRemover = async (req, res) => {

    const cookies = req.cookies;
    const refreshToken = cookies?.refreshToken;
    if (!cookies?.refreshToken) return res.status(200).json({ message: "no cookies" }); //No content

    // Is refreshToken in db?
    const foundUser = await User.findOne({ 'refreshToken.token': refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
        res.clearCookie('accessToken', { httpOnly: true, sameSite: 'None', secure: true })
        return res.status(200).json({ message: "cookies successfully removed" });
        // return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt.token !== refreshToken);;
    const result = await foundUser.save();

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
    res.clearCookie('accessToken', { httpOnly: true, sameSite: 'None', secure: true })
    res.status(200).json({ message: "cookies successfully removed" });
}


module.exports = cookiesRemover;

