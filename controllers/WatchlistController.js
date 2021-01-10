const User = require('../mongoose/User')
const Stock = require('../mongoose/Stock')
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
          console.log(req.body.stock)
          let newStockItem = new Stock({
            name: req.body.stock,
            price: stock.price
          })
          user.watchlist.push(newStockItem)
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
