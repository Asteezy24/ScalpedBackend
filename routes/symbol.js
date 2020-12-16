const express = require('express')
const SymbolsController = require('../controllers/SymbolsController')
const router = express.Router()

router.post('/', SymbolsController.symbolSearch)

module.exports = router
