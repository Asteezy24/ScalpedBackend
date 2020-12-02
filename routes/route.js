const router = require('express').Router()

const deviceIds = []
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
  deviceIds.push(deviceId)
  console.log({ error: false, message: 'New Device Token Received!' })
  return res.status(200).send({ error: false, message: 'Device Token Sent!' })
})

module.exports = {
  router: router,
  strategies: strategies,
  deviceIds: deviceIds
}
