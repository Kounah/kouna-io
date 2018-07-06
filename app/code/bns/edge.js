const moment = require('moment');
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

  edge.global(name('pveWhaleScore'), function(att) {
    let elementals = [
      att.fire,
      att.ice,
      att.wind,
      att.earth,
      att.lightning,
      att.void
    ];

    let el = elementals[0];
    elementals.forEach(e => {
      if(e.value.total > el.value.total) {
        el = e;
      }
    })

    return Math.round((att.critical.rate[0].total / 100) * att.power.value.total * (el.rate[0].total / 100) * (att.critical_damage.rate[0].total / 100) +
    (1 - (att.critical.rate[0].total / 100)) * att.power.value.total * (el.rate[0].total / 100), 0);
  })

  edge.global(name('mainElement'), function(att) {
    let elementals = [
      att.fire,
      att.ice,
      att.wind,
      att.earth,
      att.lightning,
      att.void
    ];

    let el = elementals[0];
    elementals.forEach(e => {
      if(e.value.total > el.value.total) {
        el = e;
      }
    })

    return el;
  })
}
