const mongoose = require('mongoose')

const alertSchema = new mongoose.Schema({
  action: { type: String, trim: true, required: true },
  underlying: { type: String, trim: true, required: true }
})

module.exports = mongoose.model('Alert', alertSchema)
