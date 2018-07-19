const mongoose = require('mongoose');
const Float = require('mongoose-float');

var bnsRaidSchema = mongoose.Schema({
  name        : String,
  description : String,
  createdOn   : Date,
  creator     : String,
  editors     : [String],
  members     : [String],
  settings    : {
    roles         : [{
      name            : String,
      description     : String,
      prefClasses     : [String],
      roleGroup       : Number,
      boss            : String,
      groups          : [Number]
    }]
  },
  groups      : [{
    title           : String,
    subtitle        : String,
    plannedFor      : Date,
    settings        : {
      signInUntil   : {
        day         : String,
        time        : String
      },
    },
    classifications: [{
      charIndex : Number,
      roles     : [Number],
    }]
  }],
  characters      : [{
    userId          : String,
    bnsCharId       : String,
    groups          : String,
  }]
})

module.exports = mongoose.model('BnsRaid', bnsRaidSchema);
