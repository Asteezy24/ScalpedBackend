const User = require('../mongoose/User')
const Stock = require('../mongoose/Stock')
const Strategy = require('../mongoose/Strategy')
const PortfolioItem = require('../mongoose/PortfolioItem')
const { body, validationResult } = require('express-validator')
const { check } = require('express-validator')
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
  body('username', 'Username must not be empty.')
    .isLength({ min: 1 })
    .trim(),
  body('underlying', 'Underlying must not be empty.')
    .isLength({ min: 1 })
    .trim(),
  body('typeOfAlert', 'Type must not be empty.')
    .isLength({ min: 1 })
    .trim(),

  // check('*').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        // return 400
        return apiResponse.validationError(
          res,
          'Validation Error. ' + errors.array()[0].msg
        )
      } else {
        let query
        if (req.body.typeOfAlert === 'Moving Average') {
          query = { username: req.body.username, action: 'Buy', identifier: req.body.typeOfAlert }
        } else {
          query = { username: req.body.username, underlyings: req.body.underlying, identifier: req.body.typeOfAlert }
        }
        Strategy.findOne(query).then(async (foundStrat) => {
          if (foundStrat !== null) {
            const filterAlert = async alert => {
              return (
                alert.typeOfAlert === req.body.typeOfAlert &&
                alert.underlying === req.body.underlying &&
                alert.action === 'Buy'
              )
            }
            let alertIndex = foundStrat.alerts.findIndex(filterAlert)
            await Strategy.updateOne(query, { ['alerts.' + alertIndex + '.actedUpon']: true })

            await Stock.findOne({ name: req.body.underlying }).then(async (stock) => {
              let item = new PortfolioItem({
                type: req.body.typeOfAlert,
                underlying: req.body.underlying,
                currentPrice: stock.price,
                currentPL: '0',
                dateBought: new Date(),
                purchasePrice: stock.price
              })

              await User.findOne({ username: req.body.username }).then((foundUser) => {
                if (foundUser !== null) {
                  foundUser.portfolio.push(item)
                  foundUser.save()
                  return apiResponse.successResponse(res, 'Success!')
                } else {
                  return apiResponse.notFoundResponse(res, 'User does not exist')
                }
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
  body('username', 'Username must not be empty.')
    .isLength({ min: 1 })
    .trim(),
  check('*').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        // return 400
        return apiResponse.validationError(
          res,
          'Validation Error. ' + errors.array()[0].msg
        )
      } else {
        // find user
        User.findOne({ username: req.body.username }).then(async foundUser => {
          // return 404 user not found
          if (foundUser === null) {
            return apiResponse.notFoundResponse(
              res,
              'User does not exist with this username'
            )
          } else {
            return apiResponse.successResponseWithData(
              res,
              'Operation success',
              foundUser.portfolio
            )
          }
        })
      }
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  }
]
