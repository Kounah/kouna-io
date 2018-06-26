const BnsChar = require('../../models/bnschar');
const Stat = require('./Stat');

module.exports = function(html, abilities, gear) {
  var newChar = new BnsChar();

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

  if(typeof abilities === 'Object') {
    // attack
    newChar.stats.attack.power = new Stat({
      name:   "Attack Power",
      value:  getValues("attack_power_value")
    });
    newChar.stats.attack.pvp_power = new Stat({
      name:   "PvP Attack Power",
      value:  getValues("pc_attack_power_rate")
    });
    newChar.stats.attack.boss_power = new Stat({
      name:   "Boss Attack Power",
      value:  getValues("boss_attack_power_value")
    });
    newChar.stats.attack.pierce = new Stat({
      name:   "Piercing",
      value:  getValues("attack_pierce_value"),
      rates:  [
        getValues("attack_defend_pierce_rate", "Defense Piercing"),
        getValues("attack_parry_pierce_rate", "Block Piercing")
      ]
    });
    newChar.stats.attack.hit = new Stat({
      name:   "Accuracy",
      value:  getValues("attack_hit_value"),
      rate:   getValues("attack_hit_rate", "Hit Rate")
    });
    newChar.stats.attack.critical = new Stat({
      name:   "Critical Hit",
      value:  getValues("attack_critical_value"),
      rate:   getValues("attack_critical_rate", "Critical Rate")
    });
    newChar.stats.attack.critical_damage = new Stat({
      name:   "Critical Damage",
      value:  getValues("attack_critical_damage_value"),
      rate:   getValues("attack_critical_damage_rate", "Damage Bonus")
    });
    newChar.stats.attack.damage_modify = new Stat({
      name:   "Additional Damage",
      value:  getValues("attack_damage_modify_diff"),
      rate:   getValues("attack_damage_modify_rate")
    });
    newChar.stats.attack.fire = new Stat({
      name:   "Flame Elemental",
      value:  getValues("attack_attribute_fire_value"),
      rate:   getValues("attack_attribute_fire_rate"),
    });
    newChar.stats.attack.ice = new Stat({
      name:   "Frost Elemental",
      value:  getValues("attack_attribute_ice_value"),
      rate:   getValues("attack_attribute_ice_rate"),
    });
    newChar.stats.attack.wind = new Stat({
      name:   "Wind Elemental",
      value:  getValues("attack_attribute_wind_value"),
      rate:   getValues("attack_attribute_wind_rate"),
    });
    newChar.stats.attack.earth = new Stat({
      name:   "Earth Elemental",
      value:  getValues("attack_attribute_earth_value"),
      rate:   getValues("attack_attribute_earth_rate"),
    });
    newChar.stats.attack.lightning = new Stat({
      name:   "Lightning Elemental",
      value:  getValues("attack_attribute_lightning_value"),
      rate:   getValues("attack_attribute_lightning_rate"),
    });
    newChar.stats.attack.void = new Stat({
      name:   "Shadow Elemental",
      value:  getValues("attack_attribute_void_value"),
      rate:   getValues("attack_attribute_void_rate"),
    });#
    newChar.stats.attack.debuff = new Stat({
      name:   "Debuff Damage",
      value:  getValues("abnormal_attack_power_value"),
      rate:   getValues("abnormal_attack_power_rate", "Damage Bonus")
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
      rate:   getValues("hate_power_rate", "Threat Rate")
    });

    newChar.stats.defend.max_hp = new Stat({
      name:   "Max. HP",
      value:  getValues("max_hp")
    });
    newChar.stats.defend.power = new Stat({
      name:   "Defense",
      value:  getValues("defend_power_value"),
    });
    newChar.stats.defend.boss_power = new Stat({
      name:   "Boss Defense",
      value:  getValues("boss_defend_power_value"),
      rate:   getValues("boss_defend_power_rate", "Damage Reduction")
    });
    newChar.stats.defend.pvp_power = new Stat({
      name:   "PvP Defense",
      value:  getValues("pc_defend_power_value"),
      rate:   getValues("pc_defend_power_rate", "Damage Reduction")
    });
    newChar.stats.defend.aoe_power = new Stat({
      name:   "AOE Defense",
      value:  getValues("aoe_defend_power_value"),
      rate:   getValues("aoe_defend_power_rate", "Damage Reduction")
    });
    newChar.stats.defend.debuff = new Stat({
      name:   "Debuff Defense",
      value:  getValues("abnormal_defend_power_value"),
      rate:  getValues("abnormal_defend_power_rate", "Damage Reduction")
    });
    newChar.stats.defend.dodge = new Stat({
      name:   "Evasion",
      value:  getValues("defend_dodge_value"),
      rate:  getValues("defend_dodge_rate", "Evade Chance")
    });
    newChar.stats.defend.parry = new Stat({
      name:   "Block",
      value:  getValues("defend_parry_value"),
      rates: [
        getValues("defend_parry_reduce_rate", "Damage Reduction"),
        getValues("perfect_parry_damage_reduce_rate", "Improve Block"),
        getValues("defend_parry_rate", "Block Rate")
      ]
    });
    newChar.stats.defend.critical = new Stat({
      name:   "Critical Defense"
      value:  getValues("defend_critical_value"),
      rate:   getValues("defend_critical_damage_rate", "Damage Reduction")
    });
    newChar.stats.defend.willpower = new Stat({
      name:   "Willpower",
      value:  getValues("defend_stiff_duration_level")
    });
    newChar.stats.defend.hp_regen = new Stat({
      name:   "HP Regen",
      value:  getValues("hp_regen")
    });
    newChar.stats.defend.hp_regen_combat = new Stat({
      name:   "HP Regen (Combat)",
      value:  getValues("hp_regen_combat")
    });
    newChar.stats.defend.heal_power = new Stat({
      name:   "Recovery",
      value:  getValues("heal_power_value"),
      rate:   getValues("heal_power_rate", "Recovery Chance")
    });
  }

}
