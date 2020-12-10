const Strategy = require('../mongoose/Strategy')
const { body, validationResult } = require('express-validator')
const { check } = require('express-validator')
const apiResponse = require('../helpers/apiResponse')
// const auth = require('../middlewares/jwt')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

// Strategy Schema
function StrategyData (data) {
  this.identifier = data.id
  this.action = data.action
  this.alerts = data.alerts
}

/**
 * Strategy save.
 *
 * @param {string}      id
 * @param {string}      action
 * @param {Array.<Object>}  alerts
 *
 * @returns {Object}
 */

exports.strategyCreate = [
  // auth,
  body('action', 'Action must not be empty.').isLength({ min: 1 }).trim(),
  body('identifier', 'Strategy Identifier must not be empty').isLength({ min: 1 }).trim().custom((value, { req }) => {
    return Strategy.findOne({ identifier: req.body.identifier }).then(strategy => {
      if (strategy) {
        return Promise.reject('Strategy already exist with this ID.')
      }
    })
  }),
  check('*').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req)
      const strategy = new Strategy({
        identifier: req.body.identifier,
        action: req.body.action,
        alerts: []
      })

      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      } else {
        // Save strategy.
        strategy.save(function (err) {
          if (err) { return apiResponse.ErrorResponse(res, err) }
          let strategyData = new StrategyData(strategy)
          return apiResponse.successResponseWithData(res, 'Strategy add Success.', strategyData)
        })
      }
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  }
]

// const notify = require('../utils/notify')
// const remoteNotifications = require('../utils/remoteNotifications')
// const User = require('../mongoose/User')
// const Strategy = require('../mongoose/Strategy')
// const Alert = require('../mongoose/Alert')
// //
// // setTimeout(function () {
// //   strategyTriggered('', 'Buy', 'AAPL', '1', '1d')
// // }, 1000)
//
// function strategyTriggered (instance, signal, symbol, lastPrice, timeframe) {
//   User.findOne({ username: 'alex' }, (err, user) => {
//     if (err) return
//     if (user !== null) {
//       // push notification
//       const note = remoteNotifications.createNote()
//       remoteNotifications.send(note, user.deviceToken)
//     }
//   })
//   // update DB
//   let alert = { action: signal, underlying: symbol }
//   updateStrategyDatabase(alert)
//   console.log('blasting message for ' + symbol)
//   // slack
//   notify.sendSlackMessageMain(instance.id, signal, symbol, lastPrice, timeframe)
// }
//
// function updateStrategyDatabase (alert) {
//   let newAlert = new Alert({
//     action: alert.action,
//     underlying: alert.underlying
//   })
//
//   Strategy.findOne({ action: alert.action }, (err, strat) => {
//     if (err) return
//     if (strat !== null) {
//       strat.alerts.push(newAlert)
//       strat.save()
//       console.log({ error: false, message: 'Updated Database with alert' })
//     }
//   })
// }
//
// module.exports = {
//   strategyTriggered: strategyTriggered
// }
