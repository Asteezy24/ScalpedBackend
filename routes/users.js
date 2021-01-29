const express = require('express')
const UsersController = require('../controllers/UsersController')
const router = express.Router()

router.post('/signup', UsersController.createNewUser)

module.exports = router