const User = require("../model/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const login = async (req, res) => {
    try {
        const { email, password } = req?.body;

        //find the user from db
        const user = await User.findOne({ email });

        //check if user exists
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        //compare the provided password with hashed password from db
        const passwordMatch = await bcrypt.compare(password, user.password);

        //if password matches generate token
        if (passwordMatch) {
            const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "1m",
            });
            const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: "3m",
            });

            //save refresh token to db
            user.refreshToken.push(refreshToken);
            await user.save()

            //set httpOnly cookie
            res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: 60 * 1000 })
            res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: 3 * 60 * 1000 })

            res.status(200).json({
                message: "User successfully logged-In",
            });

        } else {
            return res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const logout = async (req, res) => {

    const cookies = req.cookies;
    if (!cookies) return res.sendStatus(204); //No content
    const refreshToken = cookies?.refreshToken;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
        return res.status(200).json({ message: "User succcessfully logged out" });
        // return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);;
    const result = await foundUser.save();

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
    res.clearCookie('accessToken')
    res.status(200).json({ message: "User succcessfully logged out" });
}

module.exports = { login, logout };
