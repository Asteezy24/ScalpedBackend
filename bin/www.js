#!/usr/bin/env node

/**
 * Module dependencies.
 */
//

const WebSocketServer = require('websocket').server
const app = require('../app')
const debug = require('debug')('Socky:server')
const http = require('http')
const log = require('../helpers/utils').log

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000')
const socketPort = normalizePort(process.env.SOCKETPORT || '1337')
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)
const socket = http.createServer(function (request, response) {
  log('Received request for ' + request.url)
  response.end()
})

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
socket.listen(socketPort)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Create Websocket.
 */

const wsServer = new WebSocketServer({
  httpServer: socket,
  protocols: ['echo-protocol'],
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
})

/**
 * Handle Socket Connections.
 */

wsServer.on('request', (request) => {
  handleConnection(request)
})

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
}

/**
 * Eligibility function to determine if origin is allowed.
 */

function originIsAllowed (origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true
}

/**
 * Handle the socket connection
 */

function handleConnection (request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject()
    log('Connection from origin ' + request.origin + ' rejected.')
    return
  }

  const connection = request.accept('echo-protocol', request.origin)
  log('Connection accepted from ' + connection.remoteAddress)
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      // save strategy
      const message = JSON.stringify({ message: 'hi' })
      log('Received Message: ' + message.utf8Data)
      connection.sendUTF(message)
    } else if (message.type === 'binary') {
      log('Received Binary Message of ' + message.binaryData.length + ' bytes')
      connection.sendBytes(message.binaryData)
    } else {
      log('unexpected format found')
    }
  })
  connection.on('close', function (reasonCode, description) {
    log('Peer ' + connection.remoteAddress + ' disconnected.')
  })
}
