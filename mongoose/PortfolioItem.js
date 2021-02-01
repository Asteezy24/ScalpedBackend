const mongoose = require('mongoose')

const portfolioItem = new mongoose.Schema({
  underlying: { type: String, trim: true, required: false },
  currentPrice: { type: String, trim: true, required: false },
  currentPL: { type: String, trim: true, required: false },
  dateBought: { type: String, trim: true, required: false },
  purchasePrice: { type: String, trim: true, required: false }
}, { versionKey: false }, { _id: false })

module.exports = mongoose.model('Portfolio Item', portfolioItem)
