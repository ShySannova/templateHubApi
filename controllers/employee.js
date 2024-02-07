const ROLES_LIST = require("../config/rolesList");
const User = require("../model/User");

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

module.exports = { addEmployeeRole };
