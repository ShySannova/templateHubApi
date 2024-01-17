const express = require('express');
const router = express.Router();

const cookiesRemover = require('../controllers/cookiesRemover');


router.get("/cookies-remover", cookiesRemover)




module.exports = router;