const verifyRoles = (...allowedRoles) => {
    try {
        return (req, res, next) => {
            if (!req?.roles) return res.status(403).json({ success: false, message: "Forbidden: no privileged" });
            const rolesArray = [...allowedRoles];
            const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
            if (!result) return res.status(403).json({ success: false, message: "Forbidden: no privileged" });
            next();
        }
    } catch (error) {
        console.error(error)
    }

}

module.exports = verifyRoles