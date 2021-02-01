const mongoose = require('mongoose')

const alertSchema = new mongoose.Schema({
  typeOfAlert: { type: String, trim: true, required: true },
  action: { type: String, trim: true, required: true },
  underlying: { type: String, trim: true, required: true },
  actedUpon: { type: Boolean, trim: true, required: true }
})

module.exports = mongoose.model('Alert', alertSchema)
