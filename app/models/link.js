const mongoose = require('mongoose');

var linkShema = mongoose.Schema({
  short: String,
  url: String,
  timestamp: Date
})

module.exports = mongoose.model('Link', linkShema);
