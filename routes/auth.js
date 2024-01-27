const express = require('express');
const router = express.Router();

const { login, logout, forgotPassword, resetPassword, verifyResetPassword, changePassword } = require('../controllers/auth');
const verifyRefreshToken = require('../middlewares/verifyRefreshToken');
const verifyAccessToken = require('../middlewares/verifyAccessToken');


router.post('/login', login)
router.get("/logout", logout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/verify-password-reset-page', verifyResetPassword)


router.post("/change-password", verifyRefreshToken, verifyAccessToken, changePassword)




module.exports = router;