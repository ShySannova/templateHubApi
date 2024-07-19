const express = require('express');
const { addEmployeeRole, deleteEmployee, findEmployerEmployees, findAllEmployees } = require('../controllers/employee');
const verifyRoles = require('../middlewares/verifyRoles');
const ROLES_LIST = require('../config/rolesList');
const router = express.Router();


router.get('/all', verifyRoles(ROLES_LIST.Admin), findAllEmployees)
router.get('/all/:employerId', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Developer), findEmployerEmployees)
router.post('/add-role', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Developer), addEmployeeRole)
router.delete('/delete/:employeeId', deleteEmployee)

module.exports = router