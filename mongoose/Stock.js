const mongoose = require('mongoose')

const stockSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: false },
  price: { type: String, trim: true, required: false }
}, { versionKey: false })

module.exports = mongoose.model('Stock', stockSchema)
