const express = require('express');
const router = express.Router();

const { findOneUser, findAllUsers, findEmployees} = require('../controllers/user');
const verifyRoles = require('../middlewares/verifyRoles');
const ROLES_LIST = require('../config/rolesList');


router.get('/', findOneUser)
router.get('/all', verifyRoles(ROLES_LIST.Admin), findAllUsers)
router.get('/employees/:employerId', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Developer), findEmployees)




module.exports = router;