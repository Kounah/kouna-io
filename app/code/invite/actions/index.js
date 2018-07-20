const fs = require('fs');
const path = require('path');

var exp = {};
fs.readdirSync(__dirname).filter(d => {
  return d != 'index.js' && path.extname(d) == '.js';
}).forEach(f => {
  exp[path.basename(f, '.js')] = require('./' + f);
})

module.exports = exp;
