const express = require('express')
const WatchlistController = require('../controllers/WatchlistController')
const router = express.Router()

router.post('/', WatchlistController.getWatchlist)
router.post('/add', WatchlistController.addToWatchlist)
router.post('/delete', WatchlistController.deleteFromWatchlist)

module.exports = router
