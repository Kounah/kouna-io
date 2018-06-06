const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  title       : String
  language    : String
  content     : String
  editors     : Array
})

module.exports = mongoose.model('Document', userSchema);
