const mongoose = require('mongoose')
const Schema = mongoose.Schema

const strategySchema = new mongoose.Schema({
  identifier: { type: String, trim: true, required: false },
  underlying: { type: String, trim: true, required: false },
  action: { type: String, trim: true, required: false },
  alerts: [{ type: Schema.Types.ObjectId, ref: 'Alert' }]
})

module.exports = mongoose.model('Strategy', strategySchema)
