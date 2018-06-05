const path = require('path');
const fs = require('fs');
const {dir, config} = require('../context');
const uid = require('uid');

module.exports = class Component {
  constructor(name, data) {
    this.name = name;
    this.data = data;
    this.path = path.join(dir, config.path.htmlComponent, name + '.html');
    if(fs.existsSync(this.path)) {
      this.name = name;
      if(fs.statSync(this.path).isFile()) {
        this.raw = '' + fs.readFileSync(this.path);
      }
    }
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
            this.content = this.content.split(fullMatch).join(spaces + ('' + res).split('\n').join('\n' + spaces));
          } else {
            this.content = this.content.split(fullMatch).join('');
          }
        } catch (err) {
          console.log(`${('[COMPONENT: ' + this.name + ']').magenta}${'[ERROR]'.red} failed to evaluate:\n${match}\n${('' + err).red}\n${err.stack}`)
        }
      });
    }

    // console.log(this.name, this.content)
    return this.content;
  }
}
