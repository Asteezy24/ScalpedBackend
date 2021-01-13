const { body, validationResult } = require('express-validator')
const { check } = require('express-validator')
const apiResponse = require('../helpers/apiResponse')
// const auth = require('../middlewares/jwt')
const mongoose = require('mongoose')
const log = require('../helpers/utils').log
const Alert = require('../mongoose/Alert')
const Strategy = require('../mongoose/Strategy')
const User = require('../mongoose/User')
const notify = require('../helpers/notify')
mongoose.set('useFindAndModify', false)

/**
 * User update.
 *
 * @param {string}      action
 * @param {string}      underlying
 *
 * @returns {Object}
 */

exports.getAlerts = [
  (req, res) => {
    User.findOne({ username: req.body.username }).then((user) => {
      if (user.strategies.length > 0) {
        buildAlertsArray(user).then(alertsArr => {
          return apiResponse.successResponseWithData(res, 'Operation success', alertsArr)
        })
      } else {
        return apiResponse.successResponseWithData(res, 'Operation success', [])
      }
    })
  }
]

exports.saveAlerts =
  (strategyIdentifier, action, underlying, timeframe, exchange) => {
    let alert = new Alert({
      action: action,
      underlying: underlying
    })

    console.log(strategyIdentifier)
    console.log(underlying)
    console.log(action)
    console.log('\n')

    Strategy.findOne({ identifier: strategyIdentifier, underlying: underlying, action: action, timeframe: timeframe }, function (err, foundStrategy) {
      if (err) {
        log(err)
      }

      console.log(foundStrategy)

      if (foundStrategy !== null) {
        foundStrategy.alerts.push(alert)

        notify.blastToAllChannels('alex', exchange, action, underlying, '', timeframe)

        foundStrategy.save((err) => {
          if (err) {
            log('error saving alert ' + err)
          }
        })
      }
    })
  }

const buildAlertsArray = async (user) => {
  let alerts = []
  for (let i = 0; i < user.strategies.length; i++) {
    await Strategy.findOne({ _id: user.strategies[i] }).then((foundStrat) => {
      for (let j = 0; j < foundStrat.alerts.length; j++) {
        let foundAlert = {
          action: foundStrat.alerts[j].action,
          underlying: foundStrat.alerts[j].underlying
        }
        alerts.push(foundAlert)
      }
    })
  }
  return alerts
}
