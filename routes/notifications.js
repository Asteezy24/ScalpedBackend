const express = require('express')
const NotificationController = require('../controllers/NotificationController')
const router = express.Router()

router.post('/updateToken/', NotificationController.updateTokenForUser)

module.exports = router
