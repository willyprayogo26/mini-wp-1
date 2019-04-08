const router = require('express').Router()
const articles = require('./articles')
const users = require('./users')
const tags = require('./tags')
const { isLogin } = require('../middlewares')
const { userController } = require('../controllers')

router.post('/registerAdmin', userController.registerAdmin)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/google-login', userController.googleLogin)

router.use(isLogin)
router.use('/articles', articles)
router.use('/users', users)
router.use('/tags', tags)

module.exports = router