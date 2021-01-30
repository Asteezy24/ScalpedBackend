const User = require('../mongoose/User')
const { body, validationResult } = require('express-validator')
const { check } = require('express-validator')
const apiResponse = require('../helpers/apiResponse')
const log = require('../helpers/utils').log
// const auth = require('../middlewares/jwt')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

/**
 * User update.
 *
 * @param {string}      username
 * @param {string}      deviceToken
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
        // return 400
        return apiResponse.validationError(res, 'Validation Error. ' + errors.array()[0].msg)
      } else {
        // find user
        User.findOne({ username: req.body.username }).then((foundUser) => {
          // return 404 user not found
          if (foundUser === null) {
            return apiResponse.notFoundResponse(res, 'User does not exist with this username')
          } else {
            // save the device token to the found user
            foundUser.deviceToken = req.body.deviceToken
            foundUser.save(function (err) {
              if (err) {
                // return 500, error on save
                return apiResponse.ErrorResponse(res, err)
              }
              // 200 success
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
