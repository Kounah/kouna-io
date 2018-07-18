const mongoose = require('mongoose');
const Float = require('mongoose-float');

var bnsRaidSchema = mongoose.Schema({
  name        : String,
  description : String,
  createdOn   : Date,
  creator     : String,
  editors     : [String],
  members     : [String],
  groups      : [{
    title           : String,
    subtitle        : String,
    plannedFor      : Date,
    settings        : {
      signInUntil   : {
        day         : String,
        time        : String
      },
      roles         : [{
        name            : String,
        description     : String,
        prefClasses     : [String],
        roleGroup       : Number
      }]
    },
    classifications: [{
      charIndex : Number,
      roles     : [Number]
    }]
  }],
  characters      : [{
    userId          : String,
    bnsCharId       : String,
  }]
})

module.exports = mongoose.model('BnsRaid', bnsRaidSchema);
