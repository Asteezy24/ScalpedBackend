const mongoose = require('mongoose')

const accessCodeSchema = new mongoose.Schema({ name: String },
  { collection: 'Access Codes' })
module.exports = mongoose.model('Access Codes', accessCodeSchema)
