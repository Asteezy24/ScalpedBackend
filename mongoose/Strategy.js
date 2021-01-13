const mongoose = require('mongoose')

const strategySchema = new mongoose.Schema({
  // Moving Average
  action: { type: String, trim: true, required: false },
  timeframe: { type: String, trim: true, required: false },
  // Yield
  yieldBuyPercent: { type: String, trim: true, required: false },
  yieldSellPercent: { type: String, trim: true, required: false },
  // Common
  identifier: { type: String, trim: true, required: false },
  underlyings: [{}],
  alerts: [{}]
}, { versionKey: false })

module.exports = mongoose.model('Strategy', strategySchema)
