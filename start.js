const dotenv = require('dotenv')
const log = require('ololog').configure({ locate: false })
const utils = require('./utils/utils')
const bodyParser = require('body-parser')
const express = require('express')
const TickerController = require('./controllers/TickerCollection')
const app = express()
const router = require('./routes/route')
const WebSocketServer = require('websocket').server
const http = require('http')
const socketHandler = require('./utils/socketHandler')
const User = require('./mongoose/User')
const mongoose = require('mongoose')
// const morgan = require('morgan')
require('ansicolor').nice

dotenv.config()
app.use(bodyParser.json())
app.use(router.router)
app.use(log)
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    if (err.status !== 404) {
      log(err) // eslint-disable-line no-console
    }
    res.json({
      message: err.message,
      error: true
    })
  })
}
// catch 404 and forward to error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    message: err.message,
    error: true
  })
})

const server = http.createServer(function (request, response) {
  console.log((new Date()) + ' Received request for ' + request.url)
  response.writeHead(404)
  response.end()
})

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true
}, () => {
  const dt = utils.dateTimeString()
  const mongooseSuccess = 'Mongoose connection established.'
  log(dt.blue, mongooseSuccess.green)
})
mongoose.Promise = global.Promise
mongoose.connection.on('error', (err) => {
  console.error(`Error!: ${err.message}`)
})

server.listen(1337, function () {
  const dt = utils.dateTimeString()
  log(dt.blue, 'Websocket is live on port 1337'.green)
})

const wsServer = new WebSocketServer({
  httpServer: server,
  protocols: ['echo-protocol'],
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
})

// start REST server
app.listen(process.env.PORT, () => {
  const dt = utils.dateTimeString()
  log(dt.blue, 'Server is live on port 3000'.green)
  TickerController.collectData()
  createDummyUser()
})

function sendSocketMessage (sentiment, underlying) {
  let message = {
    action: 'huh',
    underlying: 'foo'
  }

  wsServer.connections.forEach(function each (client) {
    console.log('sending socket message to ' + client.remoteAddress)
    client.send(JSON.stringify(message))
  })
}

wsServer.on('request', function (request) {
  socketHandler.handleConnection(request)
})

function createDummyUser () {
  User.findOne({ username: 'alex' }, (err, user) => {
    if (err) return
    if (user === null) {
      const user = new User({
        username: 'alex',
        deviceToken: '0',
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
    }
  })
}

module.exports = {
  app: app,
  sendSocketMessage: sendSocketMessage
}
