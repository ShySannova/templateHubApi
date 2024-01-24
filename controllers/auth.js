const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendResetPasswordMail } = require("../lib/mailer");


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
    const refreshToken = cookies?.refreshToken;
    // if (!cookies?.refreshToken) return res.sendStatus(204); //No content
    if (!cookies?.refreshToken) return res.status(200).json({ message: "no cookies" }); //No content

    // Is refreshToken in db?
    const foundUser = await User.findOne({ 'refreshToken.token': refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
        res.clearCookie('accessToken', { httpOnly: true, sameSite: 'None', secure: true })
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


const passwordResetTokens = {};


const forgotPassword = async (req, res) => {

    try {
        const origin = req.get('Origin');
        const { email } = req.body;

        if (!email) return res.status(404).json({ message: "please provide an email" })

        const foundUser = await User.findOne({ email }).exec();

        if (!foundUser) {
            return res.status(200).json({ message: "Email Not Vaild" })
        }


        // Generate a JWT with the user's email as part of the payload
        const resetPassToken = jwt.sign({ email }, process.env.FORGOT_PASSWORD_TOKEN_SECRET, { expiresIn: '1h' });
        const encodedToken = encodeURIComponent(resetPassToken)

        // Send the password reset link to the user's email
        const resetLink = `${origin}/reset-password/${encodedToken}/`;
        const body = {
            user_name: foundUser.name,
            user_email: foundUser.email,
            admin_message: resetLink,
            subject: "Password Recovery",
            from_name: "TemplateHub Team"
        }

        let sentSuccessfull = await sendResetPasswordMail(body)

        if (!sentSuccessfull) return res.status(500).json({ message: "some intternal error" })
        passwordResetTokens[email] = resetPassToken;


        res.status(200).json({ message: "reset url sent successfully", resetLink })


    } catch (error) {
        console.error(error.stack)
    }

}

const resetPassword = async (req, res) => {
    const { resetPassToken, newPassword } = req.body;
    console.log(resetPassToken)

    try {
        // Verify the JWT and decode the email from the payload
        const decoded = jwt.verify(resetPassToken, process.env.FORGOT_PASSWORD_TOKEN_SECRET);
        const email = decoded.email;

        const foundUser = await User.findOne({ email }).exec();

        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        //generating salt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        //hash password with salt
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        foundUser.password = hashedPassword

        await foundUser.save()

        delete passwordResetTokens[email];

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
}

const verifyResetPassword = async (req, res) => {
    try {
        const { resetPassToken } = req.body
        const decoded = jwt.verify(resetPassToken, process.env.FORGOT_PASSWORD_TOKEN_SECRET);
        const email = decoded.email;

        let serverResetToken = passwordResetTokens[email]
        if (serverResetToken === resetPassToken) {
            return res.status(200).json({ message: "access granted to page" })
        } else {
            return res.status(401).json({ message: "not vaild page" })
        }
    } catch (error) {
        console.error("some error")
        res.status(401).json({ message: "invalid reset token" })
    }

}






module.exports = { login, logout, forgotPassword, resetPassword, verifyResetPassword };
