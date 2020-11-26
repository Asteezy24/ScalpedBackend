const router = require('express').Router()

const strategies = []

// existing user log in
router.post('/strategy/', (req, res) => {
  let strat = { action: req.body.action, underlying: req.body.underlying }
  strategies.push(strat)
  console.log({ error: false, message: 'New Strategy Created!' })
  return res.status(200).send({ error: false, message: 'New Strategy Created!' })
})

module.exports = {
  router: router,
  strategies: strategies
}
