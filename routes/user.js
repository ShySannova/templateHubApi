const express = require('express');
const router = express.Router();

const { findOneUser, findAllUsers } = require('../controllers/user')


router.get('/', findOneUser)
router.get('/all', findAllUsers)




module.exports = router;