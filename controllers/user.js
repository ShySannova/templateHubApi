const User = require("../model/Users");

const findAll = async (req, res) => {
    const user = await User.find();
    res.status(200).json(user);
};

module.exports = { findAll };
