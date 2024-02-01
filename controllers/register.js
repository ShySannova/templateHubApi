const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
        });

        // Saving user to the database
        await newUser.save();

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



module.exports = { register };
