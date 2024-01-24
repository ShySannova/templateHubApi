const express = require('express');
const router = express.Router();

const { login, logout, forgotPassword, resetPassword, verifyResetPassword } = require('../controllers/auth')


router.post('/login', login)
router.get("/logout", logout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/verify-password-reset-page', verifyResetPassword)




module.exports = router;