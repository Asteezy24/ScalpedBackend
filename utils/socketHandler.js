function originIsAllowed (origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true
}

function handleConnection (request, deviceIds) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject()
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.')
    return
  }

  const connection = request.accept('echo-protocol', request.origin)
  console.log((new Date()) + ' Connection accepted.')
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      // save strategy
      const strat = JSON.stringify({ action: 'Buy', underlying: 'AAPL' })
      console.log('Received Message: ' + message.utf8Data)
      connection.sendUTF(strat)
    } else if (message.type === 'binary') {
      console.log('Received Binary Message of ' + message.binaryData.length + ' bytes')
      connection.sendBytes(message.binaryData)
    } else {
      console.log('what is this')
    }
  })
  connection.on('close', function (reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.')
  })
}

module.exports = {
  handleConnection: handleConnection
}
