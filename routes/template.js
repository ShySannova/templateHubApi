const express = require('express');
const router = express.Router();

const { createTemplate, findAllTemplates, findOneTemplate, updateTemplate, deleteTemplate } = require('../controllers/template');
const verifyAccessToken = require('../middlewares/verifyAccessToken');


router.get('/all', findAllTemplates)
router.get('/:id', findOneTemplate)

router.use(verifyAccessToken)
router.post('/create', createTemplate)
router.patch('/update/:id', updateTemplate)
router.delete('/delete/:id', deleteTemplate)




module.exports = router;