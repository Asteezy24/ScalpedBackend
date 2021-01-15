const apiResponse = require('../helpers/apiResponse')
const { body, validationResult } = require('express-validator')
// const auth = require('../middlewares/jwt')
const mongoose = require('mongoose')
const log = require('../helpers/utils').log
const Alert = require('../mongoose/Alert')
const Strategy = require('../mongoose/Strategy')
const User = require('../mongoose/User')
// const notify = require('../helpers/notify')
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
  body('username', 'Username must not be empty.').isLength({ min: 1 }).trim(),
  (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        // return 400 because of parameter validation
        return apiResponse.validationError(res, 'Validation Error. ' + errors.array()[0].msg)
      } else {
        User.findOne({ username: req.body.username }).then((user) => {
        // our function to build our array of alerts
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
          if (user.strategies.length > 0) {
            buildAlertsArray(user).then(alertsArr => {
              return apiResponse.successResponseWithData(res, 'Operation success', alertsArr)
            })
          } else {
            return apiResponse.successResponseWithData(res, 'Operation success', [])
          }
        })
      }
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  }
]

exports.saveAlert = async (strategyIdentifier, action, underlying, timeframe, exchange) => {
  let alert = new Alert({
    action: action,
    underlying: underlying
  })

  await Strategy.findOne({ identifier: strategyIdentifier, underlyings: underlying }).then((err, foundStrat) => {
    if (err) { log(err) }
    if (foundStrat !== null) {
      foundStrat.alerts.push(alert)
      // notify.blastToAllChannels('alex', exchange, action, underlying, '', timeframe)
      foundStrat.save((err) => {
        if (err) {
          log('error saving alert ' + err)
        }
      })
    }
  })
}
