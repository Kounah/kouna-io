const fs          = require('fs');
const path        = require('path');
const mongoose    = require('mongoose');
const readline    = require('readline');
const process     = require('process');
const {dir}       = require('./app/code/context');
const User        = require('./app/models/user');
const BnsChar     = require('./app/models/bnschar');
const configDB    = require('./config/database');
const colors      = require('colors');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

mongoose.connect(configDB.url);

function ask() {
  rl.question('> ', cmd => {
    try {
      eval(cmd)
    } catch (err) {
      console.log(err.message.red)
    }
    ask();
  })
}

console.log('looking for bnschars ..');

BnsChar.count().exec((err, count) => {
  if(err) return;
  console.log('counted ' + count);
  ask();
})
