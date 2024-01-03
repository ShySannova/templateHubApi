const express = require('express');
const router = express.Router();

const { createTemplate, findAllTemplates, findOneTemplate, updateTemplate, deleteTemplate } = require('../controllers/template')

router.post('/create', createTemplate)
router.get('/all', findAllTemplates)
router.get('/:id', findOneTemplate)
router.patch('/update/:id', updateTemplate)
router.delete('/delete/:id', deleteTemplate)




module.exports = router;