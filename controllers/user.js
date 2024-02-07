const User = require("../model/User");


const findAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        if (!users || users.length === 0) {
            // Handle case where no users are found
            res.status(404).json({ success: false, message: "No users found" });
        } else {
            res.status(200).json({ success: true, users });
        }
    } catch (error) {
        console.error(error);

        if (error.name === 'CastError') {
            // Handle invalid ObjectId in the request
            res.status(400).json({ success: false, message: "Invalid ObjectId in the request" });
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


const findEmpoyees = async (req, res) => {

    try {
        const employerId = req?.params?.employerId
        const employees = await User.find({ employeeOf: employerId });

        if (!employees || employees.length === 0) {
            // Handle case where no employees are found
            res.status(404).json({ success: false, message: "No employees found" });
        } else {
            res.status(200).json({ success: true, employees });
        }
    } catch (error) {
        console.error(error);

        if (error.name === 'CastError') {
            // Handle invalid ObjectId in the request
            res.status(400).json({ success: false, message: "Invalid ObjectId in the request" });
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


const findOneUser = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.sendStatus(401);
        }

        const user = await User.findOne({ 'refreshToken.token': refreshToken }).exec();

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const { _id, email, name } = user;
        res.status(200).json({ success: true, userInfo: { _id, email, name, roles: Object.keys(user.roles).filter(key => user.roles[key] !== undefined) } });
    } catch (error) {
        console.error(error);

        if (error.name === 'CastError') {
            // Handle invalid ObjectId in the request
            res.status(400).json({ success: false, message: "Invalid ObjectId in the request" });
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


module.exports = { findAllUsers, findOneUser, findEmpoyees };
