const Item = require('./Item');
<<<<<<< HEAD
const Gear = require('./Gear');
=======
>>>>>>> 8f156a481bab563698229615a9513982314b80b5

module.exports = class Weapon extends Item {
  constructor(props) {
    super(props);
<<<<<<< HEAD

    this.durability = {
      min: (props.durability ? props.durability.min | 0 : 0),
      max: (props.durability ? props.durability.max | 0 : 0)
    }

    this.gems = props.gems | new Array();
=======
>>>>>>> 8f156a481bab563698229615a9513982314b80b5
  }
}
