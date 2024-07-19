const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ROLES_LIST = require("../config/rolesList");
const { generateVerificationCode } = require("../utils/helpers");
const { verifyAccountContent } = require("../utils/htmlContentForEmail");
const { sendMail } = require("../lib/mailer");

const register = async (req, res) => {
    try {
        const { name, email, password } = req?.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User with this email already exists" });
        }

        // Generating salt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash password with salt
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with hashed password
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            verificationCode: {
                code: generateVerificationCode(),
                expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Set expiration to 1 hour from now
            },
        });

        // Saving user to the database
        await newUser.save();

        const body = {
            user_name: newUser.name,
            user_email: newUser.email,
            admin_message: newUser.verificationCode.code,
            subject: "Verification Code For TemplateHub Account",
            html: verifyAccountContent(newUser.name, newUser.email, newUser.verificationCode.code, "TemplateHub Team"),
            from_name: "TemplateHub Team"
        };

        let sentSuccessfully = await sendMail(body);

        if (!sentSuccessfully) {
            return res.status(500).json({ success: false, message: "Some internal error occurred" });
        }

        res.status(201).json({ success: true, message: "User Successfully Registered! Please Login" });
    } catch (error) {
        console.error("Error registering user", error);

        if (error.name === 'ValidationError') {
            // Handle validation errors (e.g., required fields missing)
            res.status(400).json({ success: false, message: "Validation error: Please check your data" });
        } else if (error.message.includes('timeout')) {
            // Handle timeout-related errors
            res.status(503).json({ success: false, message: "Database operation timed out" });
        } else if (error.name === 'MongoNetworkError') {
            // Handle network-related errors
            res.status(503).json({ success: false, message: "Database connection error" });
        } else {
            // Handle other unexpected errors
            res.status(500).json({ success: false, message: "Internal Server Error: Please try again later" });
        }
    }
};

const registerAsDeveloper = async (req, res) => {
    try {
        const { name, email, password } = req?.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User with this email already exists" });
        }

        // Generating salt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash password with salt
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with hashed password
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            roles: { Developer: ROLES_LIST.Developer },
            verificationCode: {
                code: generateVerificationCode(),
                expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Set expiration to 1 hour from now
            },
        });

        // Saving user to the database
        await newUser.save();

        const body = {
            user_name: newUser.name,
            user_email: newUser.email,
            admin_message: newUser.verificationCode.code,
            subject: "Verification Code For TemplateHub Account",
            html: verifyAccountContent(newUser.name, newUser.email, newUser.verificationCode.code, "TemplateHub Team"),
            from_name: "TemplateHub Team"
        };

        let sentSuccessfully = await sendMail(body);

        if (!sentSuccessfully) {
            return res.status(500).json({ success: false, message: "Some internal error occurred" });
        }

        res.status(201).json({ success: true, message: "User Successfully Registered! Please Login" });
    } catch (error) {
        console.error("Error registering user", error);

        if (error.name === 'ValidationError') {
            // Handle validation errors (e.g., required fields missing)
            res.status(400).json({ success: false, message: "Validation error: Please check your data" });
        } else if (error.message.includes('timeout')) {
            // Handle timeout-related errors
            res.status(503).json({ success: false, message: "Database operation timed out" });
        } else if (error.name === 'MongoNetworkError') {
            // Handle network-related errors
            res.status(503).json({ success: false, message: "Database connection error" });
        } else {
            // Handle other unexpected errors
            res.status(500).json({ success: false, message: "Internal Server Error: Please try again later" });
        }
    }
};

const registerEmployee = async (req, res) => {
    try {
        const { name, email, password, employerId } = req?.body;

        if (!name || !email || !password || !employerId) return res.status(400).json({ success: false, message: "provide vaild data" })

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Employee with this email already exists" });
        }

        // Generating salt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash password with salt
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with hashed password
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            employeeOf: employerId,
            verificationCode: {
                code: generateVerificationCode(),
                expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Set expiration to 1 hour from now
            },
        });

        // Saving user to the database
        await newUser.save();

        const body = {
            user_name: newUser.name,
            user_email: newUser.email,
            admin_message: newUser.verificationCode.code,
            subject: "Verification Code For TemplateHub Account",
            html: verifyAccountContent(newUser.name, newUser.email, newUser.verificationCode.code, "TemplateHub Team"),
            from_name: "TemplateHub Team"
        };

        let sentSuccessfully = await sendMail(body);

        if (!sentSuccessfully) {
            return res.status(500).json({ success: false, message: "Some internal error occurred" });
        }

        res.status(201).json({ success: true, message: "Employee Successfully Registered! Please Login" });
    } catch (error) {
        console.error("Error registering Employee", error);

        if (error.name === 'ValidationError') {
            // Handle validation errors (e.g., required fields missing)
            res.status(400).json({ success: false, message: "Validation error: Please check your data" });
        } else if (error.message.includes('timeout')) {
            // Handle timeout-related errors
            res.status(503).json({ success: false, message: "Database operation timed out" });
        } else if (error.name === 'MongoNetworkError') {
            // Handle network-related errors
            res.status(503).json({ success: false, message: "Database connection error" });
        } else {
            // Handle other unexpected errors
            res.status(500).json({ success: false, message: "Internal Server Error: Please try again later" });
        }
    }
};



module.exports = { register, registerAsDeveloper, registerEmployee };
