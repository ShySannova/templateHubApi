const ROLES_LIST = require("../config/rolesList");
const User = require("../model/User");

const findAllEmployees = async (req, res) => {

    try {
        const employees = await User.find({ employeeOf: { $exists: true } });

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


const findEmployerEmployees = async (req, res) => {

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

const addEmployeeRole = async (req, res) => {
    try {
        const { employeeId } = req.body;
        let role = req.body.role
        if (!employeeId || !role) {
            return res.status(400).json({ success: false, message: "Provide valid data" });
        }

        if (role === "Editor") {
            role = { Editor: ROLES_LIST.Editor }
        }
        if (role === "Author") {
            role = { Author: ROLES_LIST.Author }
        }

        if (role === "Disabled") {
            role = {}
        }

        console.log(role)

        const foundEmployee = await User.findByIdAndUpdate(employeeId, { roles: { User: ROLES_LIST.User, ...role } });

        if (!foundEmployee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }


        res.status(200).json({ success: true, message: "Role updated successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const employeeId = req?.params?.employeeId;
        const data = await User.deleteOne({ _id: employeeId });

        if (data.deletedCount === 1) {
            // The template was successfully deleted
            res.status(200).json({ success: true, message: "Employee deleted successfully" });
        } else if (data.deletedCount === 0) {
            // Handle case where template with the specified ID is not found
            res.status(404).json({ success: false, message: "Employee not found" });
        } else {
            // Handle other unexpected cases
            res.status(500).json({ success: false, message: "Internal Server Error: Please try again later" });
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

module.exports = { findAllEmployees, findEmployerEmployees, addEmployeeRole, deleteEmployee };
