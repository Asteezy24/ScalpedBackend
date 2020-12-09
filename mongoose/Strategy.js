const mongoose = require('mongoose')

const strategySchema = new mongoose.Schema({
  identifier: { type: String, trim: true, required: false },
  action: { type: String, trim: true, required: false },
  alerts: [{}]
})

module.exports = mongoose.model('Strategy', strategySchema)
