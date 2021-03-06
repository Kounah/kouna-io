const fs = require('fs');
const path = require('path');
const {dir, config} = require('../context');
const Component = require('./Component');
const uid = require('uid');

module.exports = class Template {
  constructor(name, data) {
    this.name = name;
    this.path = path.join(dir, config.path.htmlTemplate, name + '.html');
    if(fs.existsSync(this.path)) {
      if(fs.statSync(this.path).isFile()) {
        this.raw = '' + fs.readFileSync(this.path);
      }
    }

    if(data != undefined) this.data = data;
  }

  context(context) {
    this.context = context;
    return this;
  }

  write(p) {
    if(this.writes == undefined) this.writes = {};
    if(this.curWrites == undefined) this.curWrites = [];

    let id = uid();
    this.curWrites.push(id);
    this.writes[id] = p;
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
            this.content = this.content.split(fullMatch).join(spaces + res).split('\n').join('\n' + spaces);
          } else {
            this.content = this.content.split(fullMatch).join('');
          }
        } catch (err) {
          console.log(`${('[COMPONENT: ' + this.name + ']').magenta}${'[ERROR]'.red} failed to evaluate:\n${match}\n${('' + err).red}\n${err.stack}`);
        }
      });
    }

    return this.content;
  }

  async renderAsync(callback) {
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

          let asyncPlaceholders = '';
          if(this.curWrites != undefined) asyncPlaceholders = this.curWrites.map(id => {
            console.log(id);

              this.content.split(`#${id}#`).join(writes[id]);
            return `#${id}#`;
          }).join('');

          if(res != undefined) {
            this.content = this.content.split(fullMatch).join(spaces + (asyncPlaceholders + res).split('\n').join('\n' + spaces));
          } else {
            this.content = this.content.split(fullMatch).join(asyncPlaceholders + '');
          }
        } catch (err) {
          console.log(`${('[COMPONENT: ' + this.name + ']').magenta}${'[ERROR]'.red} failed to evaluate:\n${match}\n${('' + err).red}\n${err.stack}`);
        }
      });
    }


    callback(this.content);
  }
}
