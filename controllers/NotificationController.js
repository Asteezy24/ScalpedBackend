const User = require('../mongoose/User')
const { body, validationResult } = require('express-validator')
const { check } = require('express-validator')
const apiResponse = require('../helpers/apiResponse')
// const auth = require('../middlewares/jwt')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

// User Schema
function UserData (data) {
  this.username = data.username
  this.deviceToken = data.deviceToken
  this.strategies = data.strategies
}

/**
 * User update.
 *
 * @param {string}      username
 * @param {string}      deviceToken
 * @param {Array.<Object>}  strategies
 *
 * @returns {Object}
 */

exports.updateTokenForUser = [
  body('username', 'Username must not be empty.').isLength({ min: 1 }).trim(),
  check('*').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return apiResponse.validationError(res, 'Validation Error. ' + errors.array()[0].msg)
      } else {
        User.findOne({ username: req.body.username }, function (err, foundUser) {
          if (err) {
            console.log(err)
            return apiResponse.ErrorResponse(res, 'Error on user retrieval')
          }
          if (foundUser === null) {
            return apiResponse.notFoundResponse(res, 'User does not exist with this username')
          } else {
            foundUser.deviceToken = req.body.deviceToken
            foundUser.save(function (err) {
              if (err) {
                return apiResponse.ErrorResponse(res, err)
              }
              // let userData = new UserData(foundUser)
              return apiResponse.successResponse(res, 'Updated device token.')
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
