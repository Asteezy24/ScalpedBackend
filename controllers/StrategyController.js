const Strategy = require('../mongoose/Strategy')
const User = require('../mongoose/User')
const { body, validationResult } = require('express-validator')
const { check } = require('express-validator')
const apiResponse = require('../helpers/apiResponse')
// const auth = require('../middlewares/jwt')
const mongoose = require('mongoose')
const log = require('../helpers/utils').log
mongoose.set('useFindAndModify', false)

// Strategy Schema
function StrategyData (data) {
  this.identifier = data.id
  this.action = data.action
  this.alerts = data.alerts
}

/**
 * Strategy List.
 *
 * @returns {Object}
 */
exports.strategyGet = [
  function (req, res) {
    try {
      User.findOne({ username: req.body.username }).then((user) => {
        if (user.strategies.length > 0) {
          buildStrategiesArray(user).then(strategiesArr => {
            return apiResponse.successResponseWithData(res, 'Operation success', strategiesArr)
          })
        } else {
          return apiResponse.successResponseWithData(res, 'Operation success', [])
        }
      })
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  }
]

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
    return Strategy.findOne({ identifier: req.body.identifier, underlying: req.body.underlying, action: req.body.action }).then(strategy => {
      if (strategy) {
        return Promise.reject('Strategy already exists with this ID.')
      }
    })
  }),
  check('*'),
  (req, res) => {
    try {
      const errors = validationResult(req)
      const strategy = new Strategy({
        underlying: req.body.underlying,
        identifier: req.body.identifier,
        action: req.body.action,
        timeframe: req.body.timeframe,
        alerts: []
      })
      console.log(req.body.timeframe)
      let username = req.body.username
      if (errors.isEmpty()) {
        // save to user
        User.findOne({ username: username }, (err, user) => {
          if (user !== null && !err && errors.isEmpty()) {
            user.strategies.push(strategy._id)
            user.save((err) => {
              if (!err) {
                log('New Strategy Created for User!')
                strategy.save()
                // let strategyData = new StrategyData(strategy)
                return apiResponse.successResponse(res, 'Strategy Add Success.')
              } else {
                return apiResponse.ErrorResponse(res, err)
              }
            })
          }
        })
      } else {
        // validation error
        return apiResponse.validationError(res, 'Validation Error. ' + errors.array()[0].msg)
      }
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  }
]

const buildStrategiesArray = async (user) => {
  let strategies = []
  for (let i = 0; i < user.strategies.length; i++) {
    await Strategy.findOne({ _id: user.strategies[i] }).then((foundStrat) => {
      let strategyToPush = {
        timeframe: foundStrat.timeframe,
        underlying: foundStrat.underlying,
        identifier: foundStrat.identifier,
        action: foundStrat.action
      }
      strategies.push(strategyToPush)
    })
  }
  return strategies
}
