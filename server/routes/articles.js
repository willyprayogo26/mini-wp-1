const router = require('express').Router()
const { articleController } = require('../controllers')
const { isAuthorizedUser } = require('../middlewares')
const { image } = require('../helpers')

router.get('/', articleController.getAllArticle)
router.get('/:userId', articleController.getArticleByUser)
router.get('/:id/:articleId', isAuthorizedUser, articleController.getArticleById)
router.get('/:id/find/:tagName', articleController.getArticleByTag)
router.post('/:id', isAuthorizedUser, image.multer.single('image'), image.sendUploadToGCS, articleController.createArticle)
router.put('/:id/:articleId', isAuthorizedUser, image.multer.single('image'), image.sendUploadToGCS, articleController.updateArticle)
router.put('/:id/votes/:articleId', isAuthorizedUser, articleController.voteArticle)
router.delete('/:id/:articleId', isAuthorizedUser, articleController.deleteArticle)

module.exports = router