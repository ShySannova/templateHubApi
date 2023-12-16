const express = require('express');
const router = express.Router();

const verifyRefreshToken = require('../middlewares/verifyRefreshToken');
const refreshToken = require('../controllers/refreshToken');




router.post('/refresh-token', verifyRefreshToken, refreshToken)




module.exports = router;