const mongoose = require('mongoose');

var pixivBookmarkSchema = mongoose.Schema({
  pages: Number,
  id: String,
  title: String,
  tag: String,
  author_id: String,
  author_link: String,
  link: String,
  type: String
})

module.exports = mongoose.model('PixivBookmark', pixivBookmarkSchema);
