const User = require('../mongoose/User')
const Stock = require('../mongoose/Stock')
const Alert = require('../mongoose/Alert')
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
            // IMPLEMENT
            console.log('got here ' + req.body.username + req.body.underlying)

            await Stock.findOne({ name: req.body.underlying }).then((stock) => {
              if (stock === null) {
                return apiResponse.notFoundResponse(res, 'Stock does not exist')
              } else {
                return stock.price
              }
            }).then(async (price) => {
              let item = new PortfolioItem({
                underlying: req.body.underlying,
                currentPrice: price,
                currentPL: '0',
                dateBought: new Date(),
                purchasePrice: price
              })
              return item
            }).then(async (item) => {
              // find the alert that was triggered.
              await Alert.findOne({
                typeOfAlert: req.body.typeOfAlert,
                action: 'Buy',
                underlying: req.body.underlying
              }).then((alert) => {
                if (alert === null) {
                  return apiResponse.notFoundResponse(res, 'Stock does not exist')
                } else {
                  alert.actedUpon = true
                  alert.save((err) => {
                    if (err) {
                      log('error saving alert ' + err)
                      return apiResponse.ErrorResponse(res, 'Couldnt save mongoose')
                    } else {
                      return item
                    }
                  })
                }
              }).then((item) => {
                foundUser.portfolio.push(item)
                foundUser.save((err) => {
                  if (err) {
                    log('error saving user ' + err)
                    return apiResponse.ErrorResponse(res, 'Couldnt save mongoose')
                  }
                  return apiResponse.successResponse(res, 'Success!')
                })
              })
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
