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
const AlertController = require('../Socky/controllers/AlertController')

// DB connection
const MONGODB_URL = process.env.MONGODB_URL
mongoose.connect(MONGODB_URL, { useNewUrlParser: true }).then(() => {
  // don't show the log when it is test
  if (process.env.NODE_ENV !== 'test') {
    log('Connected to ' + MONGODB_URL)
    log('App is running ... \n')
  }
})
  .catch(err => {
    console.error('App starting error:', err.message)
    process.exit(1)
  })
// const db = mongoose.connection
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

function createDummyUser () {
  User.findOne({ username: 'alex' }, (err, user) => {
    if (err) return
    if (user === null) {
      const user = new User({
        username: 'alex',
        deviceToken: '0',
        watchlist: [],
        strategies: []
      })
      user.save((err) => {
        if (err) {
          if (err.name === 'MongoError' && err.code === 11000) {
            console.log('User already registered')
          }
          console.log(err.message)
          return
        }
        console.log('New user created!')
      })
    } else {
      console.log('user exists already')
      //AlertController.saveAlerts('GMMA', 'Buy', 'AAPL')
    }
  })
}

// start the data collection process
createDummyUser()
TickerCollection.collectData()

module.exports = app
