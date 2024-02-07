const express = require('express');
const router = express.Router();

const verifyAccessToken = require('../middlewares/verifyAccessToken');
const verifyRoles = require('../middlewares/verifyRoles');
const ROLES_LIST = require('../config/rolesList');
const { register, registerAsDeveloper, registerEmployee } = require('../controllers/register');


router.post('/register', register);

router.post('/register-developer', registerAsDeveloper);

router.post('/register-employee', verifyAccessToken, verifyRoles(ROLES_LIST.Developer), registerEmployee);



module.exports = router;