const mongoose = require('mongoose');

var docSchema = mongoose.Schema({
  title       : String,
  type        : String,
  content     : String,
  creator     : String,
  description : String,
  topic       : String,
  public      : Boolean,
  created     : Date,
  modified    : Date,
  color       : String,
  editors     : Array,
  media       : Array
})

module.exports = mongoose.model('Document', docSchema);
