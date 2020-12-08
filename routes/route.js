const router = require('express').Router()
const User = require('../mongoose/User')
const strategies = []

// existing user log in
router.post('/strategy/', (req, res) => {
  let strat = { action: req.body.action, underlying: req.body.underlying }
  strategies.push(strat)
  console.log({ error: false, message: 'New Strategy Created!' })
  return res.status(200).send({ error: false, message: 'New Strategy Created!' })
})

router.post('/notification/provider', (req, res) => {
  let deviceId = req.body.id
  let username = req.body.username
  // find username, and update device token
  let newData = {
    username: username,
    deviceToken: deviceId
  }

  User.findOneAndUpdate({ username: username }, newData, (err, user) => {
    if (err) return
    if (user !== null) {
      console.log({ error: false, message: 'New Device Token Received!' })
    }
  })
  return res.status(200).send({ error: false, message: 'Device Token Sent!' })
})

module.exports = {
  router: router,
  strategies: strategies
}
