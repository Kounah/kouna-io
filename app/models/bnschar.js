const mongoose = require('mongoose');

const Stat    = require('../code/bns/Stat');
const Weapon  = require('../code/bns/Weapon');
const Gear    = require('../code/bns/Gear');
const Outfit  = require('../code/bns/Outfit')

var bnsCharSchema = mongoose.Schema({
  general: {
    account   : String,
    name      : String,
    class     : String,
    level     : String,
    hm        : String,
    server    : String,
    faction   : String,
    clan      : String,
    avatar    : String
  },
  stats: {
    attack: {
      power           : Object, // Stat
      pvp_power       : Object, // Stat
      boss_power      : Object, // Stat
      pierce          : Object, // Stat
      hit             : Object, // Stat
      critical        : Object, // Stat
      critical_damage : Object, // Stat
      damage_modify   : Object, // Stat
      fire            : Object, // Stat
      ice             : Object, // Stat
      wind            : Object, // Stat
      earth           : Object, // Stat
      lightning       : Object, // Stat
      void            : Object, // Stat
      debuff          : Object, // Stat
      mastery         : Object, // Stat
      concentrate     : Object, // Stat
      hate            : Object, // Stat
    },
    defend: {
      max_hp          : Object, // Stat
      power           : Object, // Stat
      aoe_power       : Object, // Stat
      pvp_power       : Object, // Stat
      boss_power      : Object, // Stat
      debuff_power    : Object, // Stat
      dodge           : Object, // Stat
      parry           : Object, // Stat
      critical        : Object, // Stat
      damage_reduction: Object, // Stat
      willpower       : Object, // Stat
      hp_regen        : Object, // Stat
      hp_regen_combat : Object, // Stat
      heal_power      : Object  // Stat
    }
  },
  gear: {
    weapon          : Object, // Weapon
    ring            : Object, // Gear
    earring         : Object, // Gear
    necklace        : Object, // Gear
    bracelet        : Object, // Gear
    belt            : Object, // Gear
    glove           : Object, // Gear
    soul            : Object, // Gear
    heart           : Object, // Gear
    pet             : Object, // Gear
    outfit          : Object, // Outfit
    adornment       : Object, // Outfit
    head_adornment  : Object, // Outfit
    face_adornment  : Object  //Outfit
  }
});

module.exports = mongoose.model('BnsChar', bnsCharSchema);
