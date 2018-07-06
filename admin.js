const fs          = require('fs');
const path        = require('path');
const mongoose    = require('mongoose');
const readline    = require('readline');
const process     = require('process');
const {dir}       = require('./app/code/context');
const User        = require('./app/models/user');
const configDB    = require('./config/database')

mongoose.connect(configDB.url);

User.findOne({
    'local.email': process.argv[2]
}).exec((err, u) => {
  if(err)
    throw err;

  if(u.admin == undefined) {
    u.admin = false;
  } else {
    if(process.argv[3] == undefined) {
      u.admin = !u.admin;
    } else {
      if(process.argv[3].toLowerCase() == 'true')
        u.admin = true;
      if(process.argv[3].toLowerCase() == 'false')
        u.admin = false;
    }
  }
  u.save((err, newU) => {
    if(err)
      throw err;

    console.log('change successful, admin is now ' + newU.admin);
    mongoose.connection.close();
  })
})
