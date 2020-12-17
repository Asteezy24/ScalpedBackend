const { body, validationResult } = require('express-validator')
const { check } = require('express-validator')
const apiResponse = require('../helpers/apiResponse')
// const auth = require('../middlewares/jwt')
const mongoose = require('mongoose')
const log = require('../helpers/utils').log
const Alert = require('../mongoose/Alert')
const Strategy = require('../mongoose/Strategy')
const User = require('../mongoose/User')
mongoose.set('useFindAndModify', false)

// User Schema
function AlertData (data) {
  this.action = data.action
  this.underlying = data.underlying
}

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
        let alerts = []
        for (let i = 0; i < user.strategies.length; i++) {
          Strategy.findOne({ _id: user.strategies[i] }).then((foundStrat) => {
            for (let j = 0; j < foundStrat.alerts.length; j++) {
              let foundAlert = {
                action: foundStrat.alerts[j].action,
                underlying: foundStrat.alerts[j].underlying
              }
              alerts.push(foundAlert)
            }
            return apiResponse.successResponseWithData(res, 'Operation success', alerts)
          })
        }
      } else {
        return apiResponse.successResponseWithData(res, 'Operation success', [])
      }
    })
  }
]

exports.saveAlerts =
  (strategyIdentifier, action, underlying) => {
    let alert = new Alert({
      action: action,
      underlying: underlying
    })

    Strategy.findOne({ identifier: strategyIdentifier, underlying: underlying, action: action }, function (err, foundStrategy) {
      if (err) {
        log(err)
      }
      if (foundStrategy !== null) {
        foundStrategy.alerts.push(alert)
        foundStrategy.save((err) => {
          if (err) {
            log('error saving alert ' + err)
          }
        })
      }
    })
  }
