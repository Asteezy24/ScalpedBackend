const express = require('express')
const PortfolioController = require('../controllers/PortfolioController')
const router = express.Router()

router.post('/', PortfolioController.getPortfolio)
router.post('/buy', PortfolioController.addToPortfolio)

module.exports = router
