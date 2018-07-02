const Item = require('./Item');
const Gear = require('./Gear');

module.exports = class Weapon extends Item {
  constructor(props) {
    super(props);

    this.durability = {
      cur: (props.durability ? props.durability.cur | 0 : 0),
      max: (props.durability ? props.durability.max | 0 : 0)
    }

    this.gems = props.gems | new Array();
  }
}
