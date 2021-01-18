const Strategy = require('../mongoose/Strategy')
const User = require('../mongoose/User')
const { body, validationResult } = require('express-validator')
const { check } = require('express-validator')
const apiResponse = require('../helpers/apiResponse')
// const auth = require('../middlewares/jwt')
const mongoose = require('mongoose')
const log = require('../helpers/utils').log
mongoose.set('useFindAndModify', false)

/**
 * Strategy List.
 *
 * @param {string}      username
 *
 * @returns {Object}
 */
exports.strategyGet = [
  body('username', 'Username must not be empty.').isLength({ min: 1 }).trim(),
  (req, res) => {
    try {
      const buildStrategiesArray = async (user) => {
        let strategies = []
        for (let i = 0; i < user.strategies.length; i++) {
          await Strategy.findOne({ _id: user.strategies[i] }).then((foundStrat) => {
            let strategyToPush = {
              timeframe: foundStrat.timeframe === undefined ? '' : foundStrat.timeframe,
              underlyings: foundStrat.identifier === 'Yield' ? foundStrat.underlyings : [foundStrat.underlyings[0]],
              identifier: foundStrat.identifier,
              action: foundStrat.action === undefined ? '' : foundStrat.action,
              yieldBuyPercent: foundStrat.yieldBuyPercent === undefined ? '' : foundStrat.yieldBuyPercent,
              yieldSellPercent: foundStrat.yieldSellPercent === undefined ? '' : foundStrat.yieldSellPercent
            }
            strategies.push(strategyToPush)
          })
        }
        return strategies
      }
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        // return 400
        return apiResponse.validationError(res, 'Validation Error. ' + errors.array()[0].msg)
      } else {
        User.findOne({ username: req.body.username }).then((user) => {
          if (user.strategies.length > 0) {
            buildStrategiesArray(user).then(strategiesArr => {
              // return 200 with list of strategies
              return apiResponse.successResponseWithData(res, 'Operation success', strategiesArr)
            })
          } else {
            // return 200 with empty list
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

/**
 * Strategy save.
 *
 * Common
 * @param {string}      identifier
 * @param {string}      username
 * Moving Average
 * @param {Array.string}  underlyings
 * @param {string}      action
 * @param {string}      timeframe
 * Yield
 * @param {Array.string}      yieldUnderlyings
 * @param {string}      yieldBuyPercent
 * @param {string}      yieldSellPercent
 * @param {string}      ifFullWatchlist
 *
 * @returns {Null}
 */

exports.strategyCreate = [
  // auth,
  body('identifier', 'Strategy Identifier must not be empty').isLength({ min: 1 }).trim(),
  body('username', 'Username must not be empty.').isLength({ min: 1 }).trim(),
  check('*'),
  (req, res) => {
    try {
      const errors = validationResult(req)
      if (errors.isEmpty()) {
        const buildStrategy = async () => {
          if (req.body.identifier === 'Yield') {
            return new Strategy({
              underlyings: req.body.yieldUnderlyings,
              identifier: req.body.identifier,
              yieldBuyPercent: req.body.yieldBuyPercent,
              yieldSellPercent: req.body.yieldSellPercent,
              isFullWatchlist: req.body.isFullWatchlist,
              alerts: []
            })
          } else {
            return new Strategy({
              underlyings: [req.body.underlying],
              identifier: req.body.identifier,
              action: req.body.action,
              timeframe: req.body.timeframe,
              alerts: []
            })
          }
        }
        const returnStrategyAfterBuild = async (user) => {
          await buildStrategy().then((strategy) => {
            user.strategies.push(strategy._id)
            user.save((err) => {
              if (!err) {
                log('New Strategy Created for Username: ' + username)
                strategy.save()
                // return 200 success
                return apiResponse.successResponse(res, 'Strategy Add Success.')
              } else {
                // return 500 error saving strategy
                return apiResponse.ErrorResponse(res, err)
              }
            })
          })
        }
        let username = req.body.username
        // save to user
        User.findOne({ username: username }).then(async (user) => {
          if (user !== null && errors.isEmpty()) {
            // search for moving average
            if (req.body.identifier === 'Moving Average') {
              await Strategy.findOne({ underlyings: req.body.underlying, action: req.body.action, timeframe: req.body.timeframe }).then(async strategy => {
                if (strategy) {
                  // return 400 problems with body parameters
                  return apiResponse.validationError(res, 'Strategy already exists with this ID.')
                } else {
                  await returnStrategyAfterBuild(user)
                }
              })
            } else {
              await Strategy.findOne({ identifier: req.body.identifier, underlyings: req.body.underlying, yieldBuyPercent: req.body.yieldBuyPercent, yieldSellPercent: req.body.yieldSellPercent }).then(async strategy => {
                if (strategy) {
                  // return 400 problems with body parameters
                  return apiResponse.validationError(res, 'Strategy already exists with this ID.')
                } else {
                  await returnStrategyAfterBuild(user)
                }
              })
            }
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
