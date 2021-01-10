const User = require('../mongoose/User')
const Stock = require('../mongoose/Stock')
const WatchlistItem = require('../mongoose/WatchlistItem')
const { body, validationResult } = require('express-validator')
const { check } = require('express-validator')
const apiResponse = require('../helpers/apiResponse')
// const auth = require('../middlewares/jwt')
const log = require('../helpers/utils').log
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

exports.getWatchlist = [
  // auth,
  body('username', 'Username must not be empty.').isLength({ min: 1 }).trim(),
  check('*').escape(),
  (req, res) => {
    try {
      User.findOne({ username: req.body.username }).then((user) => {
        return apiResponse.successResponseWithData(res, 'Operation success', user.watchlist)
      })
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  }
]

exports.addToWatchlist = [
  // auth,
  body('username', 'Username must not be empty.').isLength({ min: 1 }).trim(),
  (req, res) => {
    try {
      User.findOne({ username: req.body.username }).then((user) => {
        Stock.findOne({ name: req.body.stock }).then((stock) => {
          let newWatchlistItem = new WatchlistItem({
            name: stock.name,
            price: stock.price,
            priceWhenAdded: stock.price
          })
          user.watchlist.push(newWatchlistItem)
          user.save((err) => {
            if (err) {
              log('error saving alert ' + err)
              return apiResponse.ErrorResponse(res, 'Couldnt save mongoose')
            }

            return apiResponse.successResponse(res, 'Success!')
          })
        })
      })
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  }
]

exports.deleteFromWatchlist = [
  // auth,
  body('username', 'Username must not be empty.').isLength({ min: 1 }).trim(),
  (req, res) => {
    try {
      User.findOne({ username: req.body.username }).then((user) => {
        deleteWatchlistItem(user, req.body.stock).then((user) => {
          user.save((err) => {
            if (err) {
              log('error saving alert ' + err)
              return apiResponse.ErrorResponse(res, 'Couldnt save mongoose')
            }
            return apiResponse.successResponse(res, 'Success!')
          })
        })
      })
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  }
]

const deleteWatchlistItem = async (user, stockParam) => {
  user.watchlist.forEach(function (item) {
    // iterate on something
    if (item.name === stockParam) {
      console.log('found ' + stockParam)
      user.watchlist.remove(item)
    }
  })

  return user
}
