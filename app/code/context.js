const path = require('path');
const process = require('process');

const dir = path.join(__dirname, '../..');
const config = require('./config')(dir);

console.log(dir);

module.exports  = {
  dir,
  config
}
