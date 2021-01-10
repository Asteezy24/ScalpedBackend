const express = require('express')
const notificationRouter = require('./notifications')
const strategyRouter = require('./strategy')
const alertRouter = require('./alert')
const symbolsRouter = require('./symbol')
const watchlistRouter = require('./watchlist')
const app = express()

app.use('/notification/', notificationRouter)
app.use('/strategy/', strategyRouter)
app.use('/alerts/', alertRouter)
app.use('/symbols/', symbolsRouter)
app.use('/watchlist', watchlistRouter)

module.exports = app
