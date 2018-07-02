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
};

var BnsWeapon = BnsGear;

BnsWeapon.durability = {
  cur         : Number,
  max         : Number
};
BnsWeapon.gems = [Object]


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
  weapon                : {type: BnsWeapon}, // Weapon
  gear: {
    'ring'              : {type: BnsGear}, // Gear
    'earring'           : {type: BnsGear}, // Gear
    'necklace'          : {type: BnsGear}, // Gear
    'bracelet'          : {type: BnsGear}, // Gear
    'belt'              : {type: BnsGear}, // Gear
    'gloves'            : {type: BnsGear}, // Gear
    'soul'              : {type: BnsGear}, // Gear
    'soul-2'            : {type: BnsGear}, // Gear
    'guard'             : {type: BnsGear}, // Gear
    'singongpae'        : {type: BnsGear}, // Gear
    'rune'              : {type: BnsGear}, // Gear
    'clothes'           : {type: BnsGear}, // Outfit
    'clothesDecoration' : {type: BnsGear}, // Outfit
    'tire'              : {type: BnsGear}, // Outfit
    'faceDecoration'    : {type: BnsGear}  // Outfit
  },
  soulshield: [Object]
});

module.exports = mongoose.model('BnsChar', bnsCharSchema);
