const { body, validationResult } = require('express-validator')
const { check } = require('express-validator')
const apiResponse = require('../helpers/apiResponse')
// const auth = require('../middlewares/jwt')
const mongoose = require('mongoose')
const log = require('../helpers/utils').log
const Alert = require('../mongoose/Alert')
const Strategy = require('../mongoose/Strategy')
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
  (req, res) => {}
]

exports.saveAlerts =
  (strategyIdentifier, action, underlying) => {
    let alert = new Alert({
      action: action,
      underlying: underlying
    })

    Strategy.findOne({ identifier: strategyIdentifier }, function (err, foundStrategy) {
      if (err) {
        log(err)
      }
      if (foundStrategy !== null) {
        foundStrategy.alerts.push(alert)
        foundStrategy.save((err) => {
          log('error saving alert ' + err)
        })
      }
    })
  }
