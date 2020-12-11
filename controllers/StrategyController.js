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
        return Promise.reject('Strategy already exists with this ID.')
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
                let strategyData = new StrategyData(strategy)
                return apiResponse.successResponseWithData(res, 'Strategy add Success.', strategyData)
              } else {
                return apiResponse.ErrorResponse(res, err)
              }
            })
          }
        })
      } else {
        // validation error
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      }
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  }
]
