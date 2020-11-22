const router = require('express').Router()

const strategies = []

// existing user log in
router.post('/strategy/', (req, res) => {
  console.log('got strat ' + JSON.stringify(req.body))
  let strat = { action: req.body.action, underlying: req.body.underlying }
  strategies.push(strat)
  return res.status(200).send({
    error: false
  })
})

module.exports = {
  router: router,
  strategies: strategies
}
