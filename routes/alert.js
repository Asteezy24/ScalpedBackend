const express = require('express')
const AlertController = require('../controllers/AlertController')
const router = express.Router()

router.post('/', AlertController.getAlerts)

module.exports = router
