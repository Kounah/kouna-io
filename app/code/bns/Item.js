module.exports = class Item {
  constructor (props) {
    this.name   = props.name    ? props.name    : "";
    this.rarity = props.rarity  ? props.rarity  : 0;
    this.data   = props.data    ? props.data    : new Array();
    this.icon   = props.icon    ? props.icon    : ""
  }
}
