const path = require('path');
const process = require('process');

const dir = path.join(__dirname, '../..');
const config = require('./config')(dir);

module.exports  = {
  dir,
  config
}
