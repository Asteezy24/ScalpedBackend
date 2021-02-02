const User = require('../mongoose/User')
const Stock = require('../mongoose/Stock')
const Alert = require('../mongoose/Alert')
const Strategy = require('../mongoose/Strategy')
const PortfolioItem = require('../mongoose/PortfolioItem')
const { body, validationResult } = require('express-validator')
const { check } = require('express-validator')
const log = require('../helpers/utils').log
const apiResponse = require('../helpers/apiResponse')
// const auth = require('../middlewares/jwt')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

/**
 * Add stock to a portfolio.
 *
 * @param {string}      username
 * @param {string}      underlying
 * @param {string}      typeOfAlert
 *
 * @returns {Object}
 */

exports.addToPortfolio = [
  body('username', 'Username must not be empty.').isLength({ min: 1 }).trim(),
  body('underlying', 'Underlying must not be empty.').isLength({ min: 1 }).trim(),
  body('typeOfAlert', 'Type must not be empty.').isLength({ min: 1 }).trim(),

  // check('*').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        // return 400
        return apiResponse.validationError(res, 'Validation Error. ' + errors.array()[0].msg)
      } else {
        // find user
        User.findOne({ username: req.body.username }).then(async (foundUser) => {
          // return 404 user not found
          if (foundUser === null) {
            return apiResponse.notFoundResponse(res, 'User does not exist with this username')
          } else {
            // IMPLEMENT
            await Stock.findOne({ name: req.body.underlying }).then(async (stock) => {
              if (stock === null) {
                return apiResponse.notFoundResponse(res, 'Stock does not exist')
              } else {
                let item = new PortfolioItem({
                  underlying: req.body.underlying,
                  currentPrice: stock.price,
                  currentPL: '0',
                  dateBought: new Date(),
                  purchasePrice: stock.price
                })
                // our function to build our array of alerts
                const buildAlertsArray = async (foundUser) => {
                  let alerts = []
                  for (let i = 0; i < foundUser.strategies.length; i++) {
                    await Strategy.findOne({ _id: foundUser.strategies[i] }).then((foundStrat) => {
                      for (let j = 0; j < foundStrat.alerts.length; j++) {
                        let foundAlert = {
                          typeOfAlert: foundStrat.alerts[j].typeOfAlert,
                          action: foundStrat.alerts[j].action,
                          underlying: foundStrat.alerts[j].underlying,
                          actedUpon: foundStrat.alerts[j].actedUpon
                        }
                        alerts.push(foundAlert)
                      }
                    })
                  }
                  return alerts
                }
                if (foundUser.strategies.length > 0) {
                  buildAlertsArray(foundUser).then(alertsArr => {
                    if (alertsArr === null || alertsArr.length === 0) {
                      return apiResponse.notFoundResponse(res, 'User has no alerts')
                    } else {
                      const filterAlert = async (alert) => {
                        return alert.typeOfAlert === req.body.typeOfAlert && alert.underlying === req.body.underlying && alert.action === 'Buy'
                      }
                      let alert = alertsArr.find(filterAlert)
                      alert.actedUpon = true
                      foundUser.portfolio.push(item)
                      foundUser.save((err) => {
                        if (err) {
                          log('error saving user ' + err)
                          return apiResponse.ErrorResponse(res, 'Couldnt save mongoose')
                        }
                        return apiResponse.successResponse(res, 'Success!')
                      })
                    }
                  })
                } else {
                  return apiResponse.ErrorResponse(res, 'We never had this alert to begin with.')
                }
              }
            })
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
 * Return a portfolio.
 *
 * @param {string}      username
 * @param {string}      underlying
 *
 * @returns {Object}
 */

exports.getPortfolio = [
  body('username', 'Username must not be empty.').isLength({ min: 1 }).trim(),
  check('*').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        // return 400
        return apiResponse.validationError(res, 'Validation Error. ' + errors.array()[0].msg)
      } else {
        // find user
        User.findOne({ username: req.body.username }).then(async (foundUser) => {
          // return 404 user not found
          if (foundUser === null) {
            return apiResponse.notFoundResponse(res, 'User does not exist with this username')
          } else {
            return apiResponse.successResponseWithData(res, 'Operation success', foundUser.portfolio)
          }
        })
      }
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  }
]
