const Item = require('./Item');
const Gear = require('./Gear');

module.exports = class Weapon extends Item {
  constructor(props) {
    super(props);
    this.durability = {
      min: (props.durability ? props.durability.min | 0 : 0),
      max: (props.durability ? props.durability.max | 0 : 0)
    }

    this.gems = props.gems | new Array();
  }
}
