const express = require('express')
const WatchlistController = require('../controllers/WatchlistController')
const router = express.Router()

router.post('/', WatchlistController.getWatchlist)
router.post('/add', WatchlistController.addToWatchlist)

module.exports = router
