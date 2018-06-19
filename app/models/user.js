const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  local: {
    name            : String,
    email           : String,
    password        : String,
    first_name      : String,
    last_name       : String,
    avatar          : { data: Buffer, contentType: String },
    banner          : { data: Buffer, contentType: String }
  },
  facebook          : {
    id              : String,
    token           : String,
    name            : String,
    email           : String
  },
  twitter           : {
    id              : String,
    token           : String,
    displayName     : String,
    username        : String
  },
  google            : {
    id              : String,
    token           : String,
    email           : String,
    name            : String
  },
  settings          : {
    ace             : {
      theme         : String,
      font          : String,
      fontSize      : String,
      lineHeight    : String
    }
  }
})

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
