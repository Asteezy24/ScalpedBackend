const Stock = require('../mongoose/Stock')
const { body, validationResult } = require('express-validator')
const { check } = require('express-validator')
const apiResponse = require('../helpers/apiResponse')
// const auth = require('../middlewares/jwt')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

exports.symbolSearch = [
  // auth,
  body('symbol', 'Symbol must not be empty.').isLength({ min: 1 }).trim(),
  check('*').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req)
      let symbol = req.body.symbol
      if (errors.isEmpty()) {
        Stock.find({}, (err, stocks) => {
          if (err) return

          const symbolMatches = stocks.filter(element => element.name.includes(symbol.toUpperCase()))
          const returnObject = []

          symbolMatches.forEach(function (item) {
            let symbol = {
              name: item.name
            }
            returnObject.push(symbol)
          })
          if (symbolMatches !== undefined) {
            return apiResponse.successResponseWithData(res, 'Success!', returnObject)
          } else {
            return apiResponse.validationError(res, 'No Matches!')
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
