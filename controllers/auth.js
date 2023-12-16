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
            const acessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "15m",
            });
            const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: "1h",
            });

            //save refresh token to db
            user.refreshToken = refreshToken;
            await user.save()

            //set httpOnly cookie
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 })

            res.status(200).json({
                userId: user._id,
                acessToken,
                message: "User successfully logged-In",
            });

        } else {
            return res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { login };
