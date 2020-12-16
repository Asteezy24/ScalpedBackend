const TickerCollection = require('../data collection/TickerCollection')
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
      		const symbolMatches = TickerCollection.fullListOfSymbols.filter(element => element.includes(symbol.toUpperCase()))
        if (symbolMatches !== undefined) {
          console.log(symbolMatches)
          return apiResponse.successResponseWithData(res, 'Success!', symbolMatches)
        } else {
          return apiResponse.validationError(res, 'No Matches!')
        }
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
