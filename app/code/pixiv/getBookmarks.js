const os = require('os');
const fs = require('fs');
const path = require('path');
const process = require('process');
const child_process = require('child_process');

const colors = require('colors');
const shelljs = require('shelljs');

const {PixivBookmark} = require('../../models');

function handleError(err) {
  if(err) {
    console.log(err);
  }
}

var config = {
  credentials: {
    username: '',
    password: ''
  }
}

var pixivDir = path.join(os.homedir(), 'pixiv');
shelljs.mkdir('-p', pixivDir);

var pixivCfgPath = path.join(os.homedir(), '.pixivcfg.json');

try {
  config = require(pixivCfgPath)
} catch (e) {
  console.log('could not find', pixivCfgPath.yellow, 'creating new file');
  fs.writeFileSync(pixivCfgPath, JSON.stringify(config, null, '  '))
} finally {
  console.log('config', config);
}

module.exports = function() {
  var pbd = child_process.spawn('pbd', ['-u', `${config.credentials.username}`, '-p', `${config.credentials.password}`], {cwd: pixivDir})

  var progress = 0;
  var pat = /^([0-9]+)\:\ .*?\([0-9]+\)\ by\ .*?$/
  pbd.stdout.on('data', function(d) {
    var s = d + '';
    s.split('\n').forEach(function(l) {
      var m = l.match(pat);
      if(m != null) {
        process.stdout.write('\rgetting pixiv bookmarks: ' + m[1])
      }
    })
  })

  pbd.on('exit', function() {
    try {
      var bookmarks = require(path.join(pixivDir, 'result.json'))
      bookmarks.data.forEach(bm => {

        PixivBookmark.findOne(bm).exec((err, pixivBookmark) => {
          handleError(err);

          if(pixivBookmark == null) {
            var pbm = new PixivBookmark();

            Object.keys(bm).forEach(key => {
              if(key != 'serial') {
                pbm[key] = bm[key];
              }
            });

            pbm.save((err) => {
              handleError(err);
            })
          }
        })

      })
    } catch (e) {
      console.log('error loading', path.join(pixivDir, 'result.json'));
    } finally {

    }
  })
}
