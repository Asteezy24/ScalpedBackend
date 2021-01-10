const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: false },
  price: { type: String, trim: true, required: false },
  priceWhenAdded: { type: String, trim: true, required: false }
}, { versionKey: false }, { _id: false })

module.exports = mongoose.model('WatchlistItem', itemSchema)
