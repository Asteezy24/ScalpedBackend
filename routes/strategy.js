const express = require('express')
const StrategyController = require('../controllers/StrategyController')
const router = express.Router()

router.post('/', StrategyController.strategyGet)
router.post('/create/', StrategyController.strategyCreate)

module.exports = router
