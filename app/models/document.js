const mongoose = require('mongoose');

var docSchema = mongoose.Schema({
  title       : String,
  type        : String,
  content     : String,
  creator     : String,
  description : String,
  topic       : String,
  created     : String,
  modified    : String,
  color       : String,
  editors     : Array
})

module.exports = mongoose.model('Document', docSchema);
