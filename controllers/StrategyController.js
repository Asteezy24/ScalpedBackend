const notify = require('../utils/notify')
const remoteNotifications = require('../utils/remoteNotifications')
const User = require('../mongoose/User')
const Strategy = require('../mongoose/Strategy')
const Alert = require('../mongoose/Alert')
//
// setTimeout(function () {
//   strategyTriggered('', 'Buy', 'AAPL', '1', '1d')
// }, 1000)

function strategyTriggered (instance, signal, symbol, lastPrice, timeframe) {
  User.findOne({ username: 'alex' }, (err, user) => {
    if (err) return
    if (user !== null) {
      // push notification
      const note = remoteNotifications.createNote()
      remoteNotifications.send(note, user.deviceToken)
    }
  })
  // update DB
  let alert = { action: signal, underlying: symbol }
  updateStrategyDatabase(alert)
  console.log('blasting message for ' + symbol)
  // slack
  notify.sendSlackMessageMain(instance.id, signal, symbol, lastPrice, timeframe)
}

function updateStrategyDatabase (alert) {
  let newAlert = new Alert({
    action: alert.action,
    underlying: alert.underlying
  })

  Strategy.findOne({ action: alert.action }, (err, strat) => {
    if (err) return
    if (strat !== null) {
      strat.alerts.push(newAlert)
      strat.save()
      console.log({ error: false, message: 'Updated Database with alert' })
    }
  })
}

module.exports = {
  strategyTriggered: strategyTriggered
}
