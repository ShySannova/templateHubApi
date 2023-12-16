const express = require('express');
const router = express.Router();

const { findAll } = require('../controllers/user')


router.get('/', findAll)




module.exports = router;