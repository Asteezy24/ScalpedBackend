const dotenv = require('dotenv')
const log = require('ololog').configure({ locate: false })
const utils = require('./utils/utils')
const bodyParser = require('body-parser')
const express = require('express')
const TickerController = require('./data collection/TickerCollection')
const app = express()
const router = require('./routes/route')
const WebSocketServer = require('websocket').server
const http = require('http')
const socketHandler = require('./utils/socketHandler')
const strategies = require('./routes/route').strategies
const mongoose = require('mongoose')
const morgan = require('morgan')
const ansi = require('ansicolor').nice
const remoteNotificationProvider = require('./utils/remoteNotifications')

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

// for now we will not connect to mongoose but we will pretend we did
// mongoose.connect(process.env.DATABASE, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }, () => {
//     const dt = utils.dateTimeString()
//     const mongooseSuccess = `mongoose connection established.`
//     log(dt.blue, mongooseSuccess.green)
// })
// mongoose.Promise = global.Promise
// mongoose.connection.on('error', (err) => {
//     console.error(`Error!: ${err.message}`)
// }

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
  remoteNotificationProvider.send()
})

function blastMessage () {
  remoteNotificationProvider.send(remoteNotificationProvider.note, router.deviceIds[0]).then((result) => {})
  wsServer.connections.forEach(function each (client) {
    console.log(client.remoteAddress)
    const random = strategies[Math.floor(Math.random() * strategies.length)]
    client.send(JSON.stringify(random))
  })
}

setInterval(function () {
  /// call your function here
  if (strategies[0] != undefined) {
    blastMessage()
  }
}, 12000)

wsServer.on('request', function (request) {
  socketHandler.handleConnection(request)
})

module.exports = app
