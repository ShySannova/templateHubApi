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
            const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: `${process.env.ACCESS_TOKEN_TIME_VALID}m`,
            });
            const refreshToken = jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: `${process.env.REFRESH_TOKEN_TIME_VALID}m`,
            });

            //save refresh token to db
            user.refreshToken.push({
                token: refreshToken,
                expiresAt: new Date(Date.now() + eval(process.env.REFRESH_TOKEN_MAXAGE)), // 30 mins from now
            });

            await user.save()

            //set httpOnly cookie
            res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: eval(process.env.ACCESS_TOKEN_MAXAGE) })
            res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: eval(process.env.REFRESH_TOKEN_MAXAGE) })

            const { _id, name, email } = user

            res.status(200).json({
                userInfo: { _id, name, email },
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
    const foundUser = await User.findOne({ 'refreshToken.token': refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
        return res.status(200).json({ message: "User succcessfully logged out" });
        // return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt.token !== refreshToken);;
    const result = await foundUser.save();

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
    res.clearCookie('accessToken', { httpOnly: true, sameSite: 'None', secure: true })
    res.status(200).json({ message: "User succcessfully logged out" });
}

module.exports = { login, logout };
