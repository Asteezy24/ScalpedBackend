const User = require('../mongoose/User')
const Stock = require('../mongoose/Stock')
const Strategy = require('../mongoose/Strategy')
const WatchlistItem = require('../mongoose/WatchlistItem')
const { body, validationResult } = require('express-validator')
const { check } = require('express-validator')
const apiResponse = require('../helpers/apiResponse')
// const auth = require('../middlewares/jwt')
const log = require('../helpers/utils').log
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

/**
 * Get user watchlist.
 *
 * @param {string}      username
 *
 * @returns {Array.Object}
 */

exports.getWatchlist = [
  body('username', 'Username must not be empty.').isLength({ min: 1 }).trim(),
  check('*').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req)
      if (errors.isEmpty()) {
        User.findOne({ username: req.body.username }).then((user) => {
          // 200 success
          return apiResponse.successResponseWithData(res, 'Operation success', user.watchlist)
        })
      } else {
        // validation error 400
        return apiResponse.validationError(res, 'Validation Error. ' + errors.array()[0].msg)
      }
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  }
]

/**
 * Save to watchlist.
 *
 * @param {string}      username
 * @param {string}      stock
 *
 * @returns {Null}
 */

exports.addToWatchlist = [
  // auth,
  body('username', 'Username must not be empty.').isLength({ min: 1 }).trim(),
  body('stock', 'Stock name must not be empty.').isLength({ min: 1 }).trim(),
  check('*'),
  (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        // validation error 400
        return apiResponse.validationError(res, 'Validation Error. ' + errors.array()[0].msg)
      } else {
        // find user
        User.findOne({ username: req.body.username }).then((user) => {
          if (user === undefined) {
            // throw error in json response with status 500.
            return apiResponse.ErrorResponse(res, 'Cannot find user!')
          } else {
            return user
          }
        }).then(async (user) => {
          // find stock from table. push to users watchlist
          await Stock.findOne({ name: req.body.stock }).then(async (stock) => {
            let newWatchlistItem = new WatchlistItem({
              name: stock.name,
              price: stock.price,
              priceWhenAdded: stock.price
            })
            user.watchlist.push(newWatchlistItem)
            return stock
          }).then(async (stock) => {
            // for the user's strategies, if they have a yield strategy, and its a
            // full watchlist strategy, we should update the strategy accordingly.
            await Strategy.find({ username: req.body.username }).then((foundStrat) => {
              if (foundStrat.identifier === 'Yield' && foundStrat.isFullWatchlist) {
                foundStrat.underlyings.push(stock.name)
                foundStrat.save((err) => {
                  if (err) {
                    log('error saving to watchlist ' + err)
                  }
                })
              }
            })
            user.save((err) => {
              if (err) {
                log('error saving alert ' + err)
                return apiResponse.ErrorResponse(res, 'Couldnt save mongoose')
              }
              return apiResponse.successResponse(res, 'Success!')
            })
          })
        })
      }
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  }
]

/**
 * Delete from watchlist.
 *
 * @param {string}      username
 * @param {string}      stock
 *
 * @returns {Null}
 */
exports.deleteFromWatchlist = [
  // auth,
  body('username', 'Username must not be empty.').isLength({ min: 1 }).trim(),
  body('stock', 'Stock name must not be empty.').isLength({ min: 1 }).trim(),
  check('*'),
  (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        // validation error 400
        return apiResponse.validationError(res, 'Validation Error. ' + errors.array()[0].msg)
      } else {
        const deleteWatchlistItem = async (user, stockParam) => {
          user.watchlist.forEach(function (item) {
            // iterate on something
            if (item.name === stockParam) { user.watchlist.remove(item) }
          })
          return user
        }
        User.findOne({ username: req.body.username }).then(async (user) => {
          await deleteWatchlistItem(user, req.body.stock).then(async () => {
            // for the user's strategies, if they have a yield strategy, and its a
            // full watchlist strategy, we should update the strategy accordingly.
            for (let i = 0; i < user.strategies.length; i++) {
              await Strategy.findOne({ _id: user.strategies[i] }).then((foundStrat) => {
                if (foundStrat.identifier === 'Yield' && foundStrat.isFullWatchlist) {
                  foundStrat.underlyings.remove(req.body.stock)
                  foundStrat.save((err) => {
                    if (err) {
                      log('error saving to watchlist ' + err)
                    }
                  })
                }
              })
            }
          }).then(() => {
            user.save((err) => {
              if (err) {
                // 500 error saving
                log('error saving alert ' + err)
                return apiResponse.ErrorResponse(res, 'Couldnt save mongoose')
              }
              return apiResponse.successResponse(res, 'Success!')
            })
          })
        })
      }
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  }
]
