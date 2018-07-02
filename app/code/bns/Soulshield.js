const Item = require('./Item');

module.exports = class Soulshield extends Item {
  constructor(props) {
    super(props);

    this.pos = props.pos ? props.pos : 0;
  }
}
