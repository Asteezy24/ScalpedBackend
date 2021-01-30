require('dotenv').config()
const express = require('express')
const path = require('path')
const apiRouter = require('./routes/api')
const apiResponse = require('./helpers/apiResponse')
const mongoose = require('mongoose')
const logger = require('morgan')
const log = require('./helpers/utils').log
const bodyParser = require('body-parser')
const User = require('./mongoose/User')
const TickerCollection = require('./data collection/TickerCollection')

// DB connection
const MONGODB_URL = process.env.MONGODB_URL
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  // don't show the log when it is test
  if (process.env.NODE_ENV !== 'test') {
    log('Connected to MongoDB instance')
    log('App is running ...')
  }
})
  .catch(err => {
    console.error('App starting error:', err.message)
    process.exit(1)
  })
mongoose.Promise = global.Promise

const app = express()

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'))
}
// body parser
app.use(bodyParser.json())
app.use('/api/', apiRouter)

// error handlers
// throw 404 if URL not found
app.all('*', function (req, res) {
  return apiResponse.notFoundResponse(res, 'Endpoint not found')
})

app.use((err, req, res) => {
  if (err.name === 'UnauthorizedError') {
    return apiResponse.unauthorizedResponse(res, err.message)
  }
})

app.use(express.static(path.join(__dirname, 'public')))

// start the data collection process
TickerCollection.collectData()

module.exports = app
