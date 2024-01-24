const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { name, email, password } = req?.body;

        //check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "User with this email already exists" });
        }

        //generating salt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        //hash password with salt
        const hashedPassword = await bcrypt.hash(password, salt);

        //create user with hashed password
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        //saving user to the db
        await newUser.save();

        res.status(201).json({ message: "User Successfully Registered! Please Login" });
    } catch (error) {
        console.error("Error registering user", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = { register };
