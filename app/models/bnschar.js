const mongoose = require('mongoose');
const Float    = require('mongoose-float');

const Stat    = require('../code/bns/Stat');
const Weapon  = require('../code/bns/Weapon');
const Gear    = require('../code/bns/Gear');
const Outfit  = require('../code/bns/Outfit')

var BnsStat   = {
  name        : String,
  value       : {
    total     : Number,
    base      : Number,
    equip     : Number
  },
  rate        : [{
    name      : String,
    total     : {type: Float},
    base      : {type: Float},
    equip     : {type: Float}
  }]
};

<<<<<<< HEAD
var BnsStatPick = {
  slot        : Number,
  name        : String,
  tier        : Number,
  point       : Number,
  description : String
}

var BnsGear = {
  name        : String,
  data        : Array,
  icon        : String,
  rarity      : Number
}

var BnsWeapon = BnsGear;
BnsWeapon.dura = {
  cur         : Number,
  max         : Number
};
BnsWeapon.gems = [Object]

=======
>>>>>>> 8f156a481bab563698229615a9513982314b80b5
var bnsCharSchema = mongoose.Schema({
  region      : String,
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
      power           : {type: BnsStat}, // Stat
      pvp_power       : {type: BnsStat}, // Stat
      boss_power      : {type: BnsStat}, // Stat
      pierce          : {type: BnsStat}, // Stat
      hit             : {type: BnsStat}, // Stat
      critical        : {type: BnsStat}, // Stat
      critical_damage : {type: BnsStat}, // Stat
      damage_modify   : {type: BnsStat}, // Stat
      fire            : {type: BnsStat}, // Stat
      ice             : {type: BnsStat}, // Stat
      wind            : {type: BnsStat}, // Stat
      earth           : {type: BnsStat}, // Stat
      lightning       : {type: BnsStat}, // Stat
      void            : {type: BnsStat}, // Stat
      debuff          : {type: BnsStat}, // Stat
      mastery         : {type: BnsStat}, // Stat
      concentrate     : {type: BnsStat}, // Stat
      hate            : {type: BnsStat}  // Stat
    },
    defend: {
      max_hp          : {type: BnsStat}, // Stat
      power           : {type: BnsStat}, // Stat
      aoe_power       : {type: BnsStat}, // Stat
      pvp_power       : {type: BnsStat}, // Stat
      boss_power      : {type: BnsStat}, // Stat
      debuff          : {type: BnsStat}, // Stat
      dodge           : {type: BnsStat}, // Stat
      parry           : {type: BnsStat}, // Stat
      critical        : {type: BnsStat}, // Stat
      damage_reduction: {type: BnsStat}, // Stat
      willpower       : {type: BnsStat}, // Stat
      hp_regen        : {type: BnsStat}, // Stat
      hp_regen_combat : {type: BnsStat}, // Stat
      heal_power      : {type: BnsStat}  // Stat
<<<<<<< HEAD
    },
    points: {
      offense         : Number,
      defense         : Number,
      ap              : Number,
      hp              : Number,
      elemental       : Number,
      dp              : Number,
      threat          : {type: BnsStatPick},
      move_speed      : {type: BnsStatPick},
      regen           : {type: BnsStatPick},
      hm_focus        : {type: BnsStatPick},
      debuff          : {type: BnsStatPick}
    }
  },
  gear: {
    weapon          : {type: BnsWeapon}, // Weapon
    ring            : {type: BnsGear}, // Gear
    earring         : {type: BnsGear}, // Gear
    necklace        : {type: BnsGear}, // Gear
    bracelet        : {type: BnsGear}, // Gear
    belt            : {type: BnsGear}, // Gear
    glove           : {type: BnsGear}, // Gear
    soul            : {type: BnsGear}, // Gear
    heart           : {type: BnsGear}, // Gear
    pet             : {type: BnsGear}, // Gear
    outfit          : {type: BnsGear}, // Outfit
    adornment       : {type: BnsGear}, // Outfit
    head_adornment  : {type: BnsGear}, // Outfit
    face_adornment  : {type: BnsGear}  // Outfit
=======
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
    face_adornment  : Object  // Outfit
>>>>>>> 8f156a481bab563698229615a9513982314b80b5
  }
});

module.exports = mongoose.model('BnsChar', bnsCharSchema);
