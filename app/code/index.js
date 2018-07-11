const path          = require('path');
const fs            = require('fs');
const process       = require('process');
const os            = require('os');
const filesize      = require('filesize');

const colors        = require('colors');
const asciify       = require('asciify');
const uuid          = require('uuid/v5');

const mongoose      = require('mongoose');
const passport      = require('passport');

const {dir, config} = require('./context');
const {def}         = require('./fn');

const meta          = require('./meta');

// require local
const configDB  = require('../../config/database');

// configuration
mongoose.connect(configDB.url);

require('../../config/passport')(passport);

// edge setup
var edge = require('edge.js');
require('./config/edge')(edge);

// express setup
// import modules
const express       = require('express');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const serveStatic   = require('serve-static');
const morgan        = require('morgan');
const session       = require('express-session');
const flash         = require('connect-flash');

const port = process.env.port || 8080;

// instanciate app
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret              : 'this-is-the-kouna-io-server-backend-session-secret',
  resave              : true,
  saveUninitialized   : true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/js', serveStatic(path.join(dir, 'static', 'js'), {}));
app.use('/css', serveStatic(path.join(dir, 'static', 'css'), {}));
app.use('/fonts', serveStatic(path.join(dir, 'static', 'fonts'), {}));
app.use('/img', serveStatic(path.join(dir, 'static', 'img'), {}));
app.use('/content', serveStatic(path.join(dir, '.ignore')))

require('./routes')(app, passport, edge);

app.listen(port);

// other

var creativeText = 'Some creative text will be added here as soon as I made one up.'

text: asciify('kouna.io', {font: 'univers'}, function(err, res) {
  let lines = res.split(/\r\n|\n/);
  lines     = lines.filter(l => {
    return l.match(/^\ *$/gm) == null
  });

  var width = lines[0].length;

  process.stdout.write('\r' +
    lines.map(line => {
      return ' '.repeat(process.stdout.columns).center(line)
    })
    .join('\n')
    .cyan);

  process.stdout.write('\n\n');

  process.stdout.write(' '.repeat(process.stdout.columns).center('\u2500'.repeat(width)) + '\n');

  // general
  var tableinfo = [
    ['OS platform', os.platform()],
    ['OS type', os.type()],
    ['OS release', os.release()],
    ['OS architecture', os.arch()],
    ['OS hostname', os.hostname()],
    ['SYSTEM memory', filesize(os.totalmem() - os.freemem()) + ' / ' + filesize(os.totalmem())]
  ];

  // CPUS
  tableinfo.push(['CPUs', '...']);
  var cpuinfo = (function() {
    var names   = [];
    var counts  = [];
    os.cpus().forEach((cpu, index) => {
      if(!names.includes(cpu.model)) {
        names.push(cpu.model);
        counts.push(1);
      } else {
        counts[names.indexOf(cpu.model)]++;
      }
    })

    return names.map((name, index) => {
      return counts[index] + 'x ' + name;
    })
  })()
  cpuinfo.map((cpui, index) => {
    return ['•', cpui];
  }).forEach((cpui, index) => {
    tableinfo.push(cpui);
  })

  // network
  tableinfo.push(['Network', '...']);
  (function() {
    var ifaces = os.networkInterfaces();
    return Object.keys(ifaces).map(key => {
      let iface = ifaces[key];
      return iface.filter(d => {return d.family != 'IPv6'}).map((v, i) => {
        return ['• ' + key + `[${i}]`, `${v.address}`]
      })
    })
  })().forEach(_ => {
    _.forEach(networkinfo => {
      tableinfo.push(networkinfo);
    })
  });

  tableinfo.push(['APP Port', '' + port])

  process.stdout.write(tableinfo.map(item => {
    return ' '.repeat(process.stdout.columns).center(' '.repeat(width).left(item[0]).right(item[1]));
  }).join('\n') + '\n');
});
