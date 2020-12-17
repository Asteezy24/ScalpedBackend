const SlackWebhook = require('slack-webhook')
const slackWebhookURL = 'https://hooks.slack.com/services/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'
const slack = new SlackWebhook(slackWebhookURL, {
  defaults: {
    username: 'Bot',
    channel: '#cryptosignals',
    icon_emoji: ':robot_face:'
  }
})
const apn = require('apn')
const User = require('../mongoose/User')
const log = require('../helpers/utils').log
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
  note.alert = '\uE419 You have a new crypto alert'
  note.payload = { 'action': 'John Appleseed' }
  note.topic = 'com.AlexStevens.OrionCubed'
  return note
}

function sendPushNotification (note, token) {
  apnProvider.send(note, token).then((response) => {
    // console.log(response.sent)
    // console.log(response.failed)
    // response.sent: Array of device tokens to which the notification was sent succesfully
    // response.failed: Array of objects containing the device token (`device`) and either an `error`, or a `status` and `response` from the API
  })
}

function sendSlackMessageMain (exchange, signal, ticker, lastPrice, timeframe) {
  slack.send({
    'attachments': [{
      'color': '#ffff00',
      'author_name': 'CryptoSignals',
      'title': ticker,
      'title_link': 'http://www.' + exchange + '.com',
      'fields': [{
        'title': 'Exchange',
        'value': exchange,
        'short': true
      },
      {
        'title': 'Signal',
        'value': signal,
        'short': true
      },
      {
        'title': 'Timeframe',
        'value': timeframe,
        'short': true
      },
      {
        'title': 'Current Price',
        'value': lastPrice,
        'short': true
      }
      ],
      'thumb_url': 'https://raw.githubusercontent.com/cjdowner/cryptocurrency-icons/master/128/color/' + ticker.substring(0, ticker.length - 4).toLowerCase() + '.png',
      'footer': 'Slack API'
    }]
  })
}

function blastToAllChannels (username, instance, signal, symbol, lastPrice, timeframe) {
  // push notification
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      log(err)
      return
    }
    if (user !== null) {
      // push notification
      const note = createNote()
      sendPushNotification(note, user.deviceToken)
    }
  })
  // slack
  sendSlackMessageMain(instance.id, signal, symbol, lastPrice, timeframe)
  // sockets
  //
}

module.exports = {
  blastToAllChannels: blastToAllChannels
}
