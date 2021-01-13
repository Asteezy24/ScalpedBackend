const mongoose = require('mongoose')

const strategySchema = new mongoose.Schema({
  // Moving Average
  identifier: { type: String, trim: true, required: false },
  underlying: { type: String, trim: true, required: false },
  action: { type: String, trim: true, required: false },
  timeframe: { type: String, trim: true, required: false },
  // Yield
  yieldUnderlyings: [{}],
  yieldBuyPercent: { type: String, trim: true, required: false },
  yieldSellPercent: { type: String, trim: true, required: false },
  // Common
  alerts: [{}]
}, { versionKey: false })

module.exports = mongoose.model('Strategy', strategySchema)
