var config = require('./config');

var prefix = 'BnS';
var delimeter = '_';

function name(str) {
  if(str instanceof Array) {
    str.unshift(prefix);
    return str.join(delimeter);
  } else {
    return [prefix, str].join(delimeter);
  }
}

module.exports = function(edge) {
  edge.global(name('statIcon'), function(statName) {
    return config.statIcon[statName];
  })
}
