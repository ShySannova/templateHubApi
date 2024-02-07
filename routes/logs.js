const express = require('express');
const router = express.Router();
const { getRequestLogs, getErrorLogs } = require('../controllers/logs');
const verifyRoles = require('../middlewares/verifyRoles');
const ROLES_LIST = require('../config/rolesList');


router.get('/download-all-reqlogs', verifyRoles(ROLES_LIST.Admin), getRequestLogs);

router.get('/download-all-errlogs', verifyRoles(ROLES_LIST.Admin), getErrorLogs);

module.exports = router;
