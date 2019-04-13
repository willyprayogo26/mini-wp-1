const express = require('express')
const router = express.Router()
const { tagController } = require('../controllers')

router.get('/', tagController.getAllTag)

module.exports = router