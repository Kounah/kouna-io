const fs = require('fs');
const path = require('path');
const {dir, config} = require('../context');
const Component = require('./Component');

module.exports = class Template {
  constructor(name) {
    this.name = name;
    this.path = path.join(dir, config.path.htmlTemplate, name + '.html');
    if(fs.existsSync(this.path)) {
      if(fs.statSync(this.path).isFile()) {
        this.raw = '' + fs.readFileSync(this.path);
      }
    }
  }

  context(context) {
    this.context = context;
    return this;
  }

  render() {
    let regex = /([\ |\t]*?)\{\{([\s|\S]*?)\}\}/gm;
    let m;

    this.content = this.raw;

    while ((m = regex.exec(this.raw)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      let fullMatch = m.shift();
      let spaces = m.shift();
      m.forEach((match, groupIndex) => {
        try {
          let res = eval(match);
          if(res != undefined) {
            this.content = this.content.split(fullMatch).join(spaces + res.split('\n').join('\n' + spaces));
          } else {
            this.content = this.content.split(fullMatch).join('');
          }
        } catch (err) {
          console.log(`${('[TEMPLATE: ' + this.name + ']').magenta}${'[ERROR]'.red} failed to evaluate:\n${match}\n${('' + err).red}\n${err.stack}`);
        }
      });
    }

    return this.content;
  }
}
