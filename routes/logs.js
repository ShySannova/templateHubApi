const express = require('express');
const router = express.Router();
const { getRequestLogs, getErrorLogs } = require('../controllers/logs');
const verifyRoles = require('../middlewares/verifyRoles');
const ROLES_LIST = require('../config/rolesList');
const verifyAccessToken = require('../middlewares/verifyAccessToken');


router.get('/download-all-reqlogs', verifyAccessToken, verifyRoles(ROLES_LIST.Admin), getRequestLogs);

router.get('/download-all-errlogs', verifyAccessToken, verifyRoles(ROLES_LIST.Admin), getErrorLogs);

module.exports = router;
