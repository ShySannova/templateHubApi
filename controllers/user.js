const User = require("../model/User");

const findAllUsers = async (req, res) => {
    const user = await User.find();
    res.status(200).json(user);
};

const findOneUser = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401)
    const user = await User.findOne({ 'refreshToken.token': refreshToken }).exec();
    if (!user) return res.status(404)
    const { email, name } = user
    res.status(200).json({ userInfo: { email, name } });
};

module.exports = { findAllUsers, findOneUser };
