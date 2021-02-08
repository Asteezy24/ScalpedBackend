const apiResponse = require('../helpers/apiResponse')
const { body, validationResult } = require('express-validator')
// const auth = require('../middlewares/jwt')
const mongoose = require('mongoose')
const log = require('../helpers/utils').log
const Alert = require('../mongoose/Alert')
const User = require('../mongoose/User')
const Strategy = require('../mongoose/Strategy')
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
        Strategy.find({ username: req.body.username }).then(async (strategies) => {
          let alertsArr = []
          await strategies.forEach(item => item.alerts.forEach(innerItem => alertsArr.push(innerItem)))
          if (alertsArr.length < 1) {
            return apiResponse.successResponseWithData(res, 'Operation success', [])
          } else {
            return apiResponse.successResponseWithData(res, 'Operation success', alertsArr)
          }
        })
      }
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  }
]

exports.saveYieldAlert = async (strategyIdentifier, action, underlying, username) => {
  let alert = new Alert({
    date: new Date(),
    typeOfAlert: strategyIdentifier,
    action: action,
    underlying: underlying,
    actedUpon: false
  })

  log('Trying to save yield alert for ' + underlying)

  await Strategy.findOne({ identifier: strategyIdentifier, underlyings: underlying }).then(async (foundStrat) => {
    if (foundStrat !== null) {
      foundStrat.alerts.push(alert)
      // notify.blastToAllChannels('alex', exchange, action, underlying, '', timeframe)
      alert.save()
      await foundStrat.save((err) => {
        if (err) {
          log('error saving alert ' + err)
        }
      })
      log('Saved alert!')
    }
  })
}

exports.saveMovingAverageAlert = async (strategyIdentifier, action, underlying, timeframe) => {
  let alert = new Alert({
    date: new Date(),
    typeOfAlert: strategyIdentifier,
    action: action,
    underlying: underlying,
    actedUpon: false
  })

  log('Trying to save guppy alert for ' + underlying)

  await Strategy.findOne({ identifier: strategyIdentifier, action: action, timeframe: timeframe, underlyings: underlying }).then(async (foundStrat) => {
    if (foundStrat !== null) {
      foundStrat.alerts.push(alert)
      // alert.save()
      // notify.blastToAllChannels('alex', exchange, action, underlying, '', timeframe)
      await foundStrat.save((err) => {
        if (err) {
          log('error saving alert ' + err)
        }
      })
      log('Saved alert!')
    }

    // User.findOne({ username: foundStrat.username }).then(async (foundUser) => {
    //   if (foundUser !== null) {
    //     // const filterStrategy = async (strategy) => {
    //     //   return strategy.typeOfAlert === req.body.typeOfAlert && alert.underlying === req.body.underlying && alert.action === 'Buy'
    //     // }
    //     // find the strategy we are saving to
    //
    //   }
    // })


  })
}
