const url = require('url');
const path = require('path');
const fs = require('fs');
const curl = require('curl');

const {dir} = require('../config');

const BnsChar = require('../../models/bnschar');
const Stat = require('./Stat');
const {JSDOM} = require('jsdom');

const Float    = require('mongoose-float');

const Item = require('./Item');
const Gear = require('./Gear');
const Weapon = require('./Weapon');

module.exports = function(html, abilities, gear) {
  var newChar = new BnsChar();

  console.log(abilities)

  if(typeof html === 'string') {
    d = new JSDOM(html).window.document;
    var match;

    newChar.general.account =
      d.querySelector('#header>dl.signature>dt>a').textContent;
    newChar.general.name =
      d.querySelector('#header>dl.signature>dt>span.name').textContent.split(/[\[|\]]/).join('');
    var info =
      d.querySelectorAll('#header>dl.signature>dd.desc>ul>li');

    newChar.general.class   = info[0].textContent;
    var level               =
      info[1].textContent.match(/Level\ ([0-9]{1,3})[\ \•\ HongmoonLevel ]*([0-9]{0,3})/);
    newChar.general.level   = level[1] | 0;
    newChar.general.hm      = level[2] | 0;
    newChar.general.server  = info[2].textContent;

    newChar.general.faction = info[3] !== undefined ? info[3].textContent : '';
    newChar.general.clan    = info[4] !== undefined ? info[4].textContent : '';
    newChar.general.avatar  = d.querySelector('div.charaterView>img').getAttribute('src');
  }

  function getValues(name, displayName) {
    let result = {
      total   : abilities.records.total_ability[name],
      base    : abilities.records.base_ability[name],
      equip   : abilities.records.equipped_ability[name]
    }
    if(displayName !== undefined) {
      result.name = displayName;
    }
    return result;
  }

  if(typeof abilities === 'object') {
    // attack
    newChar.stats.attack.power = new Stat({
      name:   "Attack Power",
      value:  getValues("attack_power_value")
    });
    newChar.stats.attack.pvp_power = new Stat({
      name:   "PvP Attack Power",
      value:  getValues("pc_attack_power_value")
    });
    newChar.stats.attack.boss_power = new Stat({
      name:   "Boss Attack Power",
      value:  getValues("boss_attack_power_value")
    });
    newChar.stats.attack.pierce = new Stat({
      name:   "Piercing",
      value:  getValues("attack_pierce_value"),
      rate:   [
        getValues("attack_defend_pierce_rate", "Defense Piercing"),
        getValues("attack_parry_pierce_rate", "Block Piercing")
      ]
    });
    newChar.stats.attack.hit = new Stat({
      name:   "Accuracy",
      value:  getValues("attack_hit_value"),
      rate:    getValues("attack_hit_rate", "Hit Rate")
    });
    newChar.stats.attack.critical = new Stat({
      name:   "Critical Hit",
      value:  getValues("attack_critical_value"),
      rate:    getValues("attack_critical_rate", "Critical Rate")
    });
    newChar.stats.attack.critical_damage = new Stat({
      name:   "Critical Damage",
      value:  getValues("attack_critical_damage_value"),
      rate:    getValues("attack_critical_damage_rate", "Damage Bonus")
    });
    newChar.stats.attack.damage_modify = new Stat({
      name:   "Additional Damage",
      value:  getValues("attack_damage_modify_diff"),
      rate:    getValues("attack_damage_modify_rate")
    });
    newChar.stats.attack.fire = new Stat({
      name:   "Flame Elemental",
      value:  getValues("attack_attribute_fire_value"),
      rate:    getValues("attack_attribute_fire_rate"),
    });
    newChar.stats.attack.ice = new Stat({
      name:   "Frost Elemental",
      value:  getValues("attack_attribute_ice_value"),
      rate:    getValues("attack_attribute_ice_rate"),
    });
    newChar.stats.attack.wind = new Stat({
      name:   "Wind Elemental",
      value:  getValues("attack_attribute_wind_value"),
      rate:    getValues("attack_attribute_wind_rate"),
    });
    newChar.stats.attack.earth = new Stat({
      name:   "Earth Elemental",
      value:  getValues("attack_attribute_earth_value"),
      rate:    getValues("attack_attribute_earth_rate"),
    });
    newChar.stats.attack.lightning = new Stat({
      name:   "Lightning Elemental",
      value:  getValues("attack_attribute_lightning_value"),
      rate:    getValues("attack_attribute_lightning_rate"),
    });
    newChar.stats.attack.void = new Stat({
      name:   "Shadow Elemental",
      value:  getValues("attack_attribute_void_value"),
      rate:    getValues("attack_attribute_void_rate"),
    });
    newChar.stats.attack.debuff = new Stat({
      name:   "Debuff Damage",
      value:  getValues("abnormal_attack_power_value"),
      rate:    getValues("abnormal_attack_power_rate", "Damage Bonus")
    });
    newChar.stats.attack.concentrate = new Stat({
      name:   "Concentration",
      value:  getValues("attack_concentrate_value")
    });
    newChar.stats.attack.mastery = new Stat({
      name:   "Mastery",
      value:  getValues("attack_stiff_duration_level")
    });
    newChar.stats.attack.hate = new Stat({
      name:   "Threat",
      value:  getValues("hate_power_value"),
      rate:    getValues("hate_power_rate", "Threat Rate")
    });

    newChar.stats.defend.max_hp = new Stat({
      name:   "Max. HP",
      value:  getValues("max_hp")
    });
    newChar.stats.defend.power = new Stat({
      name:   "Defense",
      value:  getValues("defend_power_value"),
      rate:   getValues("defend_physical_damage_reduce_rate", "Damage Reduction")
    });
    newChar.stats.defend.boss_power = new Stat({
      name:   "Boss Defense",
      value:  getValues("boss_defend_power_value"),
      rate:    getValues("boss_defend_power_rate", "Damage Reduction")
    });
    newChar.stats.defend.pvp_power = new Stat({
      name:   "PvP Defense",
      value:  getValues("pc_defend_power_value"),
      rate:    getValues("pc_defend_power_rate", "Damage Reduction")
    });
    newChar.stats.defend.aoe_power = new Stat({
      name:   "AoE Defense",
      value:  getValues("aoe_defend_power_value"),
      rate:    getValues("aoe_defend_damage_reduce_rate", "Damage Reduction")
    });
    newChar.stats.defend.debuff = new Stat({
      name:   "Debuff Defense",
      value:  getValues("abnormal_defend_power_value"),
      rate:   getValues("abnormal_defend_power_rate", "Damage Reduction")
    });
    newChar.stats.defend.dodge = new Stat({
      name:   "Evasion",
      value:  getValues("defend_dodge_value"),
      rate:   getValues("defend_dodge_rate", "Evade Chance")
    });
    newChar.stats.defend.parry = new Stat({
      name:   "Block",
      value:  getValues("defend_parry_value"),
      rate:  [
        getValues("defend_parry_reduce_rate", "Damage Reduction"),
        getValues("perfect_parry_damage_reduce_rate", "Improve Block"),
        getValues("defend_parry_rate", "Block Rate")
      ]
    });
    newChar.stats.defend.critical = new Stat({
      name:   "Critical Defense",
      value:  getValues("defend_critical_value"),
      rate:   getValues("defend_critical_damage_rate", "Damage Reduction")
    });
    newChar.stats.defend.damage_reduction = new Stat({
      name:   "Damage Reduction",
      value:  getValues("defend_damage_modify_diff"),
      rate:   getValues("defend_damage_modify_rate", "Rate")
    })
    newChar.stats.defend.willpower = new Stat({
      name:   "Willpower",
      value:  getValues("defend_stiff_duration_level")
    });
    newChar.stats.defend.hp_regen = new Stat({
      name:   "HP Regen",
      value:  getValues("hp_regen")
    });
    newChar.stats.defend.hp_regen_combat = new Stat({
      name:   "HP Regen Combat",
      value:  getValues("hp_regen_combat")
    });
    newChar.stats.defend.heal_power = new Stat({
      name:   "Recovery",
      value:  getValues("heal_power_value"),
      rate:    getValues("heal_power_rate", "Recovery Chance")
    });

    newChar.stats.points.offense    = abilities.records.point_ability.offense_point;
    newChar.stats.points.ap         = abilities.records.point_ability.attack_power_value;
    newChar.stats.points.elemental  = abilities.records.point_ability.attack_attribute_value;

    newChar.stats.points.threat     = abilities.records.point_ability.picks[0];
    newChar.stats.points.move_speed = abilities.records.point_ability.picks[2];

    newChar.stats.points.defense    = abilities.records.point_ability.defense_point;
    newChar.stats.points.dp         = abilities.records.point_ability.defense_power_value;
    newChar.stats.points.hp         = abilities.records.point_ability.max_hp;

    newChar.stats.points.regen      = abilities.records.point_ability.picks[1];
    newChar.stats.points.hm_focus   = abilities.records.point_ability.picks[3];
    newChar.stats.points.debuff     = abilities.records.point_ability.picks[4];
  }

  if(typeof gear === 'string') {
    let d = new JSDOM(gear).window.document;

    function getWeapon(elem) {
      var thumb = elem.querySelector('.thumb');
      var durArr = elem.querySelector('.quality .text').textContent.split(' / ');
      var dur = {
        cur: durArr[0] | 0,
        max: durArr[1] | 0
      };

      function getIcon(icoUrl) {
        var icon = icoUrl;
        var iconPath = path.join(dir, '.ignore', 'img', 'bns', 'icons', path.parse(url.parse(weap.icon).pathname));
        if(!fs.existsSync(iconPath)) {
          curl.get(icon, (err, res) => {
            if(err) throw err;

            fs.writeFileSync(iconPath, res.body);
          })
        }
      }



      var weap = new Weapon({
        name        : elem.querySelector('.name span').textContent,
        rarity      : parseInt(elem.querySelector('.name span')
        .getAttribute('class')
        .split(' ')
        .shift()
        .split('grade_') | '0'),
        data        : thumb.getAttribute('item-data').split('.').map(v => {return parseInt(v) | 0}),
        icon        : getIcon(thumb.querySelector('img').getAttribute('src'))
      })

      console.log(weap)
    }

    newChar.gear.weapon = getWeapon(d.querySelector('div.wrapWeapon'));
  }

  return newChar;
}
