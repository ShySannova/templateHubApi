const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../lib/mailer");
const ROLES_LIST = require("../config/rolesList");
const { restLinkContent, verifyAccountContent } = require("../utils/htmlContentForEmail");
const { generateVerificationCode } = require("../utils/helpers");


const login = async (req, res) => {
    try {
        const { email, password } = req?.body;

        // Find the user from the database
        const user = await User.findOne({ email });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        if (!user?.verified) {
            return res.status(302).json({ success: false, message: "redirected to verify", url: "/verify-account" })
        }

        // Compare the provided password with the hashed password from the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        // If the password matches, generate tokens
        if (passwordMatch) {
            const { _id, name, email } = user;
            const roles = Object.values(user.roles).filter(Boolean)
            const accessToken = jwt.sign({ email: user.email, roles }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: `${process.env.ACCESS_TOKEN_TIME_VALID}m`,
            });

            const refreshToken = jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: `${process.env.REFRESH_TOKEN_TIME_VALID}m`,
            });

            // Save refresh token to the database
            user.refreshToken.push({
                token: refreshToken,
                expiresAt: new Date(Date.now() + eval(process.env.REFRESH_TOKEN_MAXAGE)),
            });

            await user.save();


            // Set HTTP-only cookies
            res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: eval(process.env.ACCESS_TOKEN_MAXAGE) });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: eval(process.env.REFRESH_TOKEN_MAXAGE) });

            res.status(200).json({
                success: true,
                userInfo: { _id, name, email, roles: Object.keys(user.roles).filter(key => user.roles[key] !== undefined && user.roles[key] !== null) },
                message: "User successfully logged in",
            });
        } else {
            // Incorrect password
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const logout = async (req, res) => {
    try {
        const cookies = req.cookies;
        const refreshToken = cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(200).json({ success: false, message: "No cookies, user not logged in" });
        }

        const foundUser = await User.findOne({ 'refreshToken.token': refreshToken }).exec();

        if (!foundUser) {
            res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
            res.clearCookie('accessToken', { httpOnly: true, sameSite: 'None', secure: true });
            return res.status(200).json({ success: true, message: "User successfully logged out" });
        }

        foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt.token !== refreshToken);
        const result = await foundUser.save();

        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
        res.clearCookie('accessToken', { httpOnly: true, sameSite: 'None', secure: true });
        return res.status(200).json({ success: true, message: "User successfully logged out" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};




const passwordResetTokens = {};


const forgotPassword = async (req, res) => {
    try {
        const origin = req.get('Origin');
        const { email } = req.body;

        if (!email) return res.status(404).json({ success: false, message: "Please provide an email" });

        const foundUser = await User.findOne({ email }).exec();

        if (!foundUser) {
            return res.status(200).json({ success: false, message: "Email not valid" });
        }

        // Generate a JWT with the user's email as part of the payload
        const resetPassToken = jwt.sign({ email }, process.env.FORGOT_PASSWORD_TOKEN_SECRET, { expiresIn: '1h' });
        const encodedToken = encodeURIComponent(resetPassToken);

        // Send the password reset link to the user's email
        const resetLink = `${origin}/reset-password/${encodedToken}/`;
        const body = {
            user_name: foundUser.name,
            user_email: foundUser.email,
            admin_message: resetLink,
            subject: "Password Recovery",
            html: restLinkContent(foundUser.name, foundUser.email, resetLink, "TemplateHub Team"),
            from_name: "TemplateHub Team"
        };

        let sentSuccessfully = await sendMail(body);

        if (!sentSuccessfully) {
            return res.status(500).json({ success: false, message: "Some internal error occurred" });
        }

        passwordResetTokens[email] = resetPassToken;

        res.status(200).json({ success: true, message: "Reset URL sent successfully" });
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const resetPassword = async (req, res) => {

    try {
        const { resetPassToken, newPassword } = req.body;

        if (!resetPassToken || !newPassword) {
            return res.status(400).json({ success: false, message: 'Invalid input' });
        }

        // Verify the JWT and decode the email from the payload
        const decoded = jwt.verify(resetPassToken, process.env.FORGOT_PASSWORD_TOKEN_SECRET);
        const email = decoded.email;

        const foundUser = await User.findOne({ email }).exec();

        if (!foundUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Generating salt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash password with salt
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        foundUser.password = hashedPassword;

        await foundUser.save();

        delete passwordResetTokens[email];

        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ success: false, message: 'Token expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ success: false, message: 'Invalid token' });
        } else {
            console.error('Error during password reset:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};


const changePassword = async (req, res) => {

    try {
        const { newPassword, email } = req.body;

        if (!newPassword || !email) {
            return res.status(400).json({ success: false, message: 'Invalid input' });
        }

        const foundUser = await User.findOne({ email }).exec();

        if (!foundUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Generating salt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash password with salt
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        foundUser.password = hashedPassword;

        await foundUser.save();

        res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error during password change:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const verifyResetPassword = async (req, res) => {
    try {
        const { resetPassToken } = req.body;

        if (!resetPassToken) {
            return res.status(400).json({ success: false, message: 'Reset token not provided' });
        }

        const decoded = jwt.verify(resetPassToken, process.env.FORGOT_PASSWORD_TOKEN_SECRET);
        const email = decoded.email;

        let serverResetToken = passwordResetTokens[email];

        if (serverResetToken === resetPassToken) {
            return res.status(200).json({ success: true, message: 'Access granted to page' });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid reset token' });
        }
    } catch (error) {
        console.error('Error during reset token verification:', error);
        return res.status(401).json({ success: false, message: 'Invalid reset token' });
    }
};

const verifyAccount = async (req, res) => {
    try {
        const { code, email } = req.body;

        // Check if the verification code is provided
        if (!code) {
            return res.status(400).json({ success: false, message: "Enter a valid verification code" });
        }

        // Find the user by email
        const user = await User.findOne({ email }); // Assuming req.user contains the user's email

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the user is already verified
        if (user.verified) {
            return res.status(400).json({ success: false, message: "Account is already verified" });
        }

        // Check if the verification code is valid and has not expired
        if (
            user.verificationCode &&
            user.verificationCode.code === code &&
            user.verificationCode.expiresAt &&
            user.verificationCode.expiresAt > new Date()
        ) {
            // Code is valid and has not expired
            user.verified = true;
            user.verificationCode = { code: null, expiresAt: null }; // Clear verification code after successful verification
            await user.save();

            return res.status(200).json({ success: true, message: "Account successfully verified. Please Login To Enjoy Our Services" });
        } else {
            // Invalid code or expired
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Example route for requesting a new verification code

const requestNewVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the user is already verified
        if (user.verified) {
            return res.status(400).json({ error: 'User is already verified' });
        }

        // Generate and set a new verification code
        user.verificationCode = {
            code: generateVerificationCode(),
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Set expiration to 1 hour from now
        };

        await user.save();

        const body = {
            user_name: user.name,
            user_email: user.email,
            admin_message: user.verificationCode.code,
            subject: "Verification Code For TemplateHub Account",
            html: verifyAccountContent(user.name, user.email, user.verificationCode.code, "TemplateHub Team"),
            from_name: "TemplateHub Team"
        };

        let sentSuccessfully = await sendMail(body);

        if (!sentSuccessfully) {
            return res.status(500).json({ success: false, message: "Some internal error occurred" });
        }

        res.status(200).json({ success: true, message: 'New verification code sent successfully! Check Your Email' });
    } catch (error) {
        console.error('Error requesting new verification code:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



module.exports = { login, logout, forgotPassword, resetPassword, changePassword, verifyResetPassword, verifyAccount, requestNewVerificationCode };
