const express = require('express')
const notificationRouter = require('./notifications')
const strategyRouter = require('./strategy')
const app = express()

app.use('/notification/', notificationRouter)
app.use('/strategy/', strategyRouter)

module.exports = app
