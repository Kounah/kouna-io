module.exports = class Item {
  constructor (props) {
    console.log(props);

    this.name   = props.name    || "";
    this.rarity = props.rarity  || new Number(0);
    this.data   = props.data    || new Array();
    this.icon   = props.icon    || ""
  }
}
