module.exports = class Item {
  constructor (props) {
<<<<<<< HEAD
    console.log(props);

    this.name   = props.name    || "";
    this.rarity = props.rarity  || new Number(0);
    this.data   = props.data    || new Array();
    this.icon   = props.icon    || ""
=======
    this.name   = props.name | "";
    this.rarity = props.rarity | new Number(0);
>>>>>>> 8f156a481bab563698229615a9513982314b80b5
  }
}
