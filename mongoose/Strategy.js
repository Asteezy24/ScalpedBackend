const mongoose = require('mongoose')

const strategySchema = new mongoose.Schema({
  identifier: { type: String, trim: true, required: false },
  underlying: { type: String, trim: true, required: false },
  action: { type: String, trim: true, required: false },
  timeframe: { type: String, trim: true, required: false },
  alerts: [{}]
}, { versionKey: false })

module.exports = mongoose.model('Strategy', strategySchema)
