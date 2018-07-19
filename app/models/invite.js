const mongoose = require('mongoose');

var inviteSchema = mongoose.Schema({
  from: String, // User ID
  to: String, // User ID
  type: String,
  data: Object,
  createdOn: Date
})

module.exports = mongoose.model('Invite', inviteSchema);
