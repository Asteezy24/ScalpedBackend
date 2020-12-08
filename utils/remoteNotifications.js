const apn = require('apn')
const deviceIds = require('../routes/route').deviceIds

const options = {
  token: {
    key: './AuthKey_WFF52K7URN.p8',
    keyId: 'WFF52K7URN',
    teamId: 'C7HGN23NTW'
  },
  production: false
}

const apnProvider = new apn.Provider(options)

function createNote () {
  const note = new apn.Notification()
  note.expiry = Math.floor(Date.now() / 1000) + 3600 // Expires 1 hour from now.
  // note.badge = 69
  note.sound = 'ping.aiff'
  note.alert = '\u1F440 You have a new crypto alert'
  note.payload = { 'action': 'John Appleseed' }
  note.topic = 'com.AlexStevens.OrionCubed'
  return note
}

function send (note) {
  apnProvider.send(note, deviceIds[0]).then((result) => {})
}

module.exports = {
  send: send,
  createNote: createNote
}
