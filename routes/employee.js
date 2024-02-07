const express = require('express');
const { addEmployeeRole } = require('../controllers/employee');
const verifyRoles = require('../middlewares/verifyRoles');
const ROLES_LIST = require('../config/rolesList');
const router = express.Router();


router.post('/add-role', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Developer), addEmployeeRole)

module.exports = router