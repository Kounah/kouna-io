module.exports = class Item {
  constructor (props) {
    this.name   = props.name | "";
    this.rarity = props.rarity | new Number(0);
  }
}
