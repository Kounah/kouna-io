module.exports = class Stat() {

  constructor(props) {
    if(typeof props === 'Object') {

      if(props.name !== undefined) {
        this.name = props.name;
      }

      if(props.value !== undefined) {
        this.value {
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
        this.rate {
          name    : props.rate.name   | this.name | "";
          total   : props.rate.total  | new Number(0.0),
          base    : props.rate.base   | new Number(0.0),
          equip   : props.rate.equip  | new Number(0.0)
        }
      }

      if(props.rates !== undefined) {
        this.rates = [];
        if(props.rates instanceof Array) {
          props.rates.forEach(rate => {
            this.rates.push({
              name  : rate.name | this.name | "",
              total : rate.total | new Number(0.0),
              base  : rate.base | new Number(0.0),
              equip : rate.equip | new Number(0.0)
            })
          })
        }
      }

    }
  }
}
