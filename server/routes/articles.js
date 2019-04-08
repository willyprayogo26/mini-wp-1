const router = require('express').Router()
const { articleController } = require('../controllers')
const { isAuthorizedUser } = require('../middlewares')
const { image } = require('../helpers')

router.get('/', isAuthorizedUser, articleController.getAllArticle)
router.get('/:userId', isAuthorizedUser, articleController.getArticleByUser)
router.get('/:articleId', isAuthorizedUser, articleController.getArticleById)
router.post('/', isAuthorizedUser, image.multer.single('image'), image.sendUploadToGCS, articleController.createArticle)
router.put('/:articleId', isAuthorizedUser, articleController.updateArticle)
router.delete('/:articleId', isAuthorizedUser, articleController.deleteArticle)

module.exports = router