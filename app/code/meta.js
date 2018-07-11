const colors = require('colors');

String.prototype.center = function (text) {
  if(text.length <= this.length) {
    var start     = Math.floor(this.length / 2) - Math.floor(text.length / 2);
    var end       = Math.ceil(this.length / 2) + Math.ceil(text.length / 2);
    return this.substr(0, start) + text + this.substr(end, this.length - 1)
  } else {
    return this;
  }
}

String.prototype.left = function (text) {
  if(text.length <= this.length) {
    return text + this.substr(text.length, this.length - 1);
  } else {
    return this;
  }
}

String.prototype.right = function (text) {
  if(text.length <= this.length) {
    return this.substr(0, this.length - text.length) + text;
  } else {
    return this;
  }
}
