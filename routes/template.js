const express = require('express');
const router = express.Router();

const { createTemplate, findAllTemplates, findOneTemplate, updateTemplate, deleteTemplate, findUserTemplates, findAllPublishedTemplates } = require('../controllers/template');
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const verifyRoles = require('../middlewares/verifyRoles');
const ROLES_LIST = require('../config/rolesList');


router.get('/all/published', findAllPublishedTemplates)
router.get('/all', verifyAccessToken, verifyRoles(ROLES_LIST.Admin), findAllTemplates)
router.get('/:id', findOneTemplate)
router.get('/user/:id', findUserTemplates)


router.use(verifyAccessToken)
router.post('/create', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Developer, ROLES_LIST.Editor, ROLES_LIST.Author), createTemplate)
router.patch('/update/:id', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Developer), updateTemplate)
router.delete('/delete/:id', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Developer,), deleteTemplate)




module.exports = router;