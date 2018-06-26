module.exports = class Stat {
  constructor(props) {
    console.log(props);

    if(props instanceof Object) {

      if(props.name !== undefined) {
        this.name = props.name;
      }

      if(props.value !== undefined) {
        this.value = {
          total   : props.value.total | new Number(0),
          base    : props.value.base  | new Number(0),
          equip   : props.value.equip | new Number(0)
        }
      }

      // Might be useful sometimes, for now just left it outcommented
      /* if(props.values !== undefined) {
        this.values = [];
        if(props.values instanceof Array) {
          props.values.forEach(value => {
            this.values.push({
              total : value.total | new Number(0)
              base  : value.base  | new Number(0)
              equip : value.equip | new Number(0)
            })
          })
        }
      } */

      if(props.rate !== undefined) {
        this.rate = [];

        if(props.rate instanceof Array) {
          props.rate.forEach(r => {
            console.log(r);
            if(r.total    !== undefined
              && r.base   !== undefined
              && r.equip  !== undefined) {
              this.rate.push(r)
            }
          })
        } else {
          if(props.rate.total   !== undefined
            && props.rate.base  !== undefined
            && props.rate.equip !== undefined) {
            this.rate.push(props.rate);
          }
        }
      }
    }
  }
}
