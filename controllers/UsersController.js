const User = require('../mongoose/User')
const AccessCode = require('../mongoose/AccessCodes')
const { body, validationResult } = require('express-validator')
const { check } = require('express-validator')
const apiResponse = require('../helpers/apiResponse')
// const auth = require('../middlewares/jwt')
const log = require('../helpers/utils').log
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

/**
 * Save to watchlist.
 *
 * @param {string}      username
 * @param {string}      password
 *
 * @returns {Null}
 */

exports.createNewUser = [
  // auth,
  body('username')
    .custom(async username => {
      await User.findOne({ username: username }).then((user) => {
        if (user !== null) {
          throw new Error('A user already exists with that email')
        }
      })
    }),
  body('password', 'Password Cannot be empty').isLength({ min: 8 }).trim(),
  check('*'),
  (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        // validation error 400
        return apiResponse.validationError(res, 'Validation Error. ' + errors.array()[0].msg)
      } else {
        AccessCode.find({ name: req.body.accessCode }).then((code) => {
          if (code.length < 1) {
            return apiResponse.ErrorResponse(res, 'Invalid Access Code!')
          } else {
            const user = new User({
              username: req.body.username,
              deviceToken: '0',
              password: req.body.password,
              watchlist: [],
              strategies: []
            })
            user.save((err) => {
              if (err) {
                log('error saving user ' + err)
                return apiResponse.ErrorResponse(res, 'Couldnt save mongoose')
              }
              return apiResponse.successResponse(res, 'Success!')
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

exports.signIn = [
  // auth,
  body('username', 'Username Cannot be empty').isLength({ min: 1 }).trim(),
  body('password', 'Password Cannot be empty').isLength({ min: 1 }).trim(),
  check('*'),
  (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        // validation error 400
        return apiResponse.validationError(res, 'Validation Error. ' + errors.array()[0].msg)
      } else {
        User.findOne({ username: req.body.username }, (err, user) => {
          if (err) {
            return apiResponse.ErrorResponse(res, err)
          }

          if (!user) {
            return apiResponse.unauthorizedResponse(res, 'User does not exist!')
          }
          user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) {
              return apiResponse.ErrorResponse(res, err)
            }
            if (!isMatch) {
              return apiResponse.notFoundResponse(res, 'Invalid Username/Password')
            }
            // const token = auth.createJwtToken(user)
            return apiResponse.successResponse(res, 'Success!')
          })
        })
      }
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  }
]
