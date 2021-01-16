const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, trim: true, required: true },
  deviceToken: { type: String, trim: true, required: true },
  watchlist: [{}],
  strategies: [{}]
})

module.exports = mongoose.model('User', userSchema)
