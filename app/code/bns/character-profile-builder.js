const url = require('url');
const path = require('path');
const fs = require('fs');
const curl = require('curl');
const shell = require('shelljs');
const download = require('download');
const colors = require('colors');

const {dir} = require('../context');

const BnsChar = require('../../models/bnschar');
const Stat = require('./Stat');
const {JSDOM} = require('jsdom');

const Float    = require('mongoose-float');

const Item = require('./Item');
const Gear = require('./Gear');
const Weapon = require('./Weapon');
const Soulshield = require('./Soulshield');

module.exports = function(html, abilities, gear, char) {
  if(char == null) {
    char = new BnsChar();
    char.createdOn = new Date();
  }

  if(typeof html === 'string') {
    d = new JSDOM(html).window.document;
    var match;

    char.general.account =
      d.querySelector('#header>dl.signature>dt>a').textContent;
    char.general.name =
      d.querySelector('#header>dl.signature>dt>span.name').textContent.split(/[\[|\]]/).join('');
    var info =
      d.querySelectorAll('#header>dl.signature>dd.desc>ul>li');

    char.general.class   = info[0].textContent;
    var level               =
      info[1].textContent.match(/Level\ ([0-9]{1,3})[\ \•\ HongmoonLevel ]*([0-9]{0,3})/);
    char.general.level   = level[1] | 0;
    char.general.hm      = level[2] | 0;
    char.general.server  = info[2].textContent;

    char.general.faction = info[3] !== undefined ? info[3].textContent : '';
    char.general.clan    = info[4] !== undefined ? info[4].textContent : '';
    let img = d.querySelector('div.charaterView img');

    char.general.avatar  = img ? img.getAttribute('src') : undefined;
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
    char.stats.attack.power = new Stat({
      name:   "Attack Power",
      value:  getValues("attack_power_value")
    });
    char.stats.attack.pvp_power = new Stat({
      name:   "PvP Attack Power",
      value:  getValues("pc_attack_power_value")
    });
    char.stats.attack.boss_power = new Stat({
      name:   "Boss Attack Power",
      value:  getValues("boss_attack_power_value")
    });
    char.stats.attack.pierce = new Stat({
      name:   "Piercing",
      value:  getValues("attack_pierce_value"),
      rate:   [
        getValues("attack_defend_pierce_rate", "Defense Piercing"),
        getValues("attack_parry_pierce_rate", "Block Piercing")
      ]
    });
    char.stats.attack.hit = new Stat({
      name:   "Accuracy",
      value:  getValues("attack_hit_value"),
      rate:    getValues("attack_hit_rate", "Hit Rate")
    });
    char.stats.attack.critical = new Stat({
      name:   "Critical Hit",
      value:  getValues("attack_critical_value"),
      rate:    getValues("attack_critical_rate", "Critical Rate")
    });
    char.stats.attack.critical_damage = new Stat({
      name:   "Critical Damage",
      value:  getValues("attack_critical_damage_value"),
      rate:    getValues("attack_critical_damage_rate", "Damage Bonus")
    });
    char.stats.attack.damage_modify = new Stat({
      name:   "Additional Damage",
      value:  getValues("attack_damage_modify_diff"),
      rate:    getValues("attack_damage_modify_rate")
    });
    char.stats.attack.fire = new Stat({
      name:   "Flame Elemental",
      value:  getValues("attack_attribute_fire_value"),
      rate:    getValues("attack_attribute_fire_rate"),
    });
    char.stats.attack.ice = new Stat({
      name:   "Frost Elemental",
      value:  getValues("attack_attribute_ice_value"),
      rate:    getValues("attack_attribute_ice_rate"),
    });
    char.stats.attack.wind = new Stat({
      name:   "Wind Elemental",
      value:  getValues("attack_attribute_wind_value"),
      rate:    getValues("attack_attribute_wind_rate"),
    });
    char.stats.attack.earth = new Stat({
      name:   "Earth Elemental",
      value:  getValues("attack_attribute_earth_value"),
      rate:    getValues("attack_attribute_earth_rate"),
    });
    char.stats.attack.lightning = new Stat({
      name:   "Lightning Elemental",
      value:  getValues("attack_attribute_lightning_value"),
      rate:    getValues("attack_attribute_lightning_rate"),
    });
    char.stats.attack.void = new Stat({
      name:   "Shadow Elemental",
      value:  getValues("attack_attribute_void_value"),
      rate:    getValues("attack_attribute_void_rate"),
    });
    char.stats.attack.debuff = new Stat({
      name:   "Debuff Damage",
      value:  getValues("abnormal_attack_power_value"),
      rate:    getValues("abnormal_attack_power_rate", "Damage Bonus")
    });
    char.stats.attack.concentrate = new Stat({
      name:   "Concentration",
      value:  getValues("attack_concentrate_value")
    });
    char.stats.attack.mastery = new Stat({
      name:   "Mastery",
      value:  getValues("attack_stiff_duration_level")
    });
    char.stats.attack.hate = new Stat({
      name:   "Threat",
      value:  getValues("hate_power_value"),
      rate:    getValues("hate_power_rate", "Threat Rate")
    });

    char.stats.defend.max_hp = new Stat({
      name:   "Max. HP",
      value:  getValues("max_hp")
    });
    char.stats.defend.power = new Stat({
      name:   "Defense",
      value:  getValues("defend_power_value"),
      rate:   getValues("defend_physical_damage_reduce_rate", "Damage Reduction")
    });
    char.stats.defend.boss_power = new Stat({
      name:   "Boss Defense",
      value:  getValues("boss_defend_power_value"),
      rate:    getValues("boss_defend_power_rate", "Damage Reduction")
    });
    char.stats.defend.pvp_power = new Stat({
      name:   "PvP Defense",
      value:  getValues("pc_defend_power_value"),
      rate:    getValues("pc_defend_power_rate", "Damage Reduction")
    });
    char.stats.defend.aoe_power = new Stat({
      name:   "AoE Defense",
      value:  getValues("aoe_defend_power_value"),
      rate:    getValues("aoe_defend_damage_reduce_rate", "Damage Reduction")
    });
    char.stats.defend.debuff = new Stat({
      name:   "Debuff Defense",
      value:  getValues("abnormal_defend_power_value"),
      rate:   getValues("abnormal_defend_power_rate", "Damage Reduction")
    });
    char.stats.defend.dodge = new Stat({
      name:   "Evasion",
      value:  getValues("defend_dodge_value"),
      rate:   getValues("defend_dodge_rate", "Evade Chance")
    });
    char.stats.defend.parry = new Stat({
      name:   "Block",
      value:  getValues("defend_parry_value"),
      rate:  [
        getValues("defend_parry_reduce_rate", "Damage Reduction"),
        getValues("perfect_parry_damage_reduce_rate", "Improve Block"),
        getValues("defend_parry_rate", "Block Rate")
      ]
    });
    char.stats.defend.critical = new Stat({
      name:   "Critical Defense",
      value:  getValues("defend_critical_value"),
      rate:   getValues("defend_critical_damage_rate", "Damage Reduction")
    });
    char.stats.defend.damage_reduction = new Stat({
      name:   "Damage Reduction",
      value:  getValues("defend_damage_modify_diff"),
      rate:   getValues("defend_damage_modify_rate", "Rate")
    })
    char.stats.defend.willpower = new Stat({
      name:   "Willpower",
      value:  getValues("defend_stiff_duration_level")
    });
    char.stats.defend.hp_regen = new Stat({
      name:   "HP Regen",
      value:  getValues("hp_regen")
    });
    char.stats.defend.hp_regen_combat = new Stat({
      name:   "HP Regen Combat",
      value:  getValues("hp_regen_combat")
    });
    char.stats.defend.heal_power = new Stat({
      name:   "Recovery",
      value:  getValues("heal_power_value"),
      rate:    getValues("heal_power_rate", "Recovery Chance")
    });

    char.stats.points.offense    = abilities.records.point_ability.offense_point;
    char.stats.points.ap         = abilities.records.point_ability.attack_power_value;
    char.stats.points.elemental  = abilities.records.point_ability.attack_attribute_value;

    char.stats.points.threat     = abilities.records.point_ability.picks[0];
    char.stats.points.move_speed = abilities.records.point_ability.picks[2];

    char.stats.points.defense    = abilities.records.point_ability.defense_point;
    char.stats.points.dp         = abilities.records.point_ability.defense_power_value;
    char.stats.points.hp         = abilities.records.point_ability.max_hp;

    char.stats.points.regen      = abilities.records.point_ability.picks[1];
    char.stats.points.hm_focus   = abilities.records.point_ability.picks[3];
    char.stats.points.debuff     = abilities.records.point_ability.picks[4];
  }

  if(typeof gear === 'string') {
    let d = new JSDOM(gear).window.document;

    function getIcon(ico) {
      if(ico == undefined)
        return '';
      var icon = ico.getAttribute('src');
      var base = path.parse(url.parse(icon).pathname).base;
      var iconPath = path.join(dir, '.ignore', 'img', 'bns', 'item', base);
      if(!fs.existsSync(iconPath)) {
        download(icon).catch(function(error) {
          if(error) throw error;
        }).then(data => {
          shell.mkdir('-p', path.dirname(iconPath))

          fs.writeFileSync(iconPath, data);
        })
      }

      return '/content/img/bns/item/' + base;
    }


    function getRarity(elem) {
      return parseInt(elem
      .getAttribute('class')
      .split(' ')
      .shift()
      .split('grade_').filter(d => { return d !== ''}));
    }

    function getData(elem) {
      try {
        return elem
        .getAttribute('item-data')
        .split('.').map(v => {
          return parseInt(v) | 0
        })
      } catch (err) {
        return [];
      }
    }

    function getGem(elem) {
      let pat = /equipgem_([0-9])phase/gm;
      let img = elem.querySelector('img');
      if(img == undefined) {
        return undefined;
      }

      let gem = new Item({
        name    : img != null ? img.getAttribute('alt') : '',
        rarity  : 2,
        data    : img != null ? getData(img) : '',
        icon    : img != null ? getIcon(img) : ''
      })

      gem.rarity = gem.name.indexOf('Gilded') > -1 ? 7 : 5;

      return gem;
    }

    function getWeapon(elem) {
      var thumb = elem.querySelector('.thumb');
      var durArr = elem.querySelector('.quality .text').textContent.split(' / ');

      var dur = {
        cur: durArr[0] | 0,
        max: durArr[1] | 0
      };

      var weap = new Weapon({
        name        : elem.querySelector('.name span').textContent,
        rarity      : getRarity(elem.querySelector('.name span')),
        data        : thumb != null ? getData(thumb) : [],
        icon        : thumb != null ? getIcon(thumb.querySelector('img')) : '',
        durability  : dur
      })

      weap.gems = Array.prototype.slice.call(elem.querySelectorAll('span.iconGemSlot')).map(gem => {
        return getGem(gem);
      });

      return weap;
    }

    function getGear(elem) {
      let res = { };
      res.type  = elem.getAttribute('class').split(' ').pop();
      res.obj   = new Item({
        name    : elem.querySelector('.name span').textContent,
        rarity  : getRarity(elem.querySelector('.name span'))
      })

      try {
        let ico     = elem.querySelector('.icon img');
        res.obj.icon    = ico != null ? getIcon(ico) : '';
        res.obj.data    = ico != null ? getData(ico) : [];
      } catch (err) {
        // console.log(`no image for ${res.type.underline} because of ${('' + err).bold}`.red);
      }
      return res;
    }

    char.weapon = getWeapon(d.querySelector('div.wrapWeapon'));

    Array.prototype.slice.call(d.querySelectorAll('div.wrapAccessory')).forEach(elem => {
      let gear = getGear(elem);
      char.gear[gear.type] = gear.obj;
    })

    // ss = soulshield
    let ssIcons = Array.prototype.slice.call(d.querySelectorAll('.gemIcon span'));
    let ssAreas = Array.prototype.slice.call(d.querySelectorAll('.gemIcon map area'));

    if(ssIcons != undefined && ssAreas != undefined) {
      char.soulshield = ssIcons.map((elem, index) => {
        let pos       = parseInt(elem.getAttribute('class').match('^pos([0-9])').pop());
        let area      = ssAreas[pos - 1];

        return new Soulshield({
          name    : area.getAttribute('alt') + ' - No. ' + pos,
          rarity  : 0,
          icon    : elem != null ? getIcon(elem.querySelector('img')) : '',
          data    : elem != null ? getData(area) : [],
          pos     : pos
        })
      })
    }
  }

  char.lastMod = new Date();

  return char;
}
