const path = require('path');
const process = require('process');

const dir = process.cwd();
const config = require('./config.json');

console.log(dir);

module.exports  = {
  dir,
  config
}
