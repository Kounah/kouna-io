const os = require('os');
const filesize = require('filesize');
const asciify = require('asciify');
const {config} = require('./context');

module.exports = function() {
  asciify('kouna.io', {font: 'univers'}, function(err, res) {
    let lines = res.split(/\r\n|\n/);
    lines     = lines.filter(l => {
      return l.match(/^\ *$/gm) == null
    });

    var width = lines[0].length;
    var termWidth = process.stdout.columns;

    console.log(
      lines.map(line => {
        return ' '.repeat(termWidth).center(line)
      })
      .join('\n')
      .cyan
    );


    console.log(' '.repeat(termWidth).center('\u2500'.repeat(width).center(`  ${require('../../package.json').version}  `)));

    // general
    var tableinfo = [
      ['OS platform', os.platform()],
      ['OS type', os.type()],
      ['OS release', os.release()],
      ['OS architecture', os.arch()],
      ['OS hostname', os.hostname()],
      ['SYSTEM memory', filesize(os.totalmem() - os.freemem()) + ' / ' + filesize(os.totalmem())],
      ['SYSTEM uptime', `${Math.trunc(os.uptime/3600)}h ${Math.trunc((os.uptime%3600)/60)}m ${Math.trunc((os.uptime%3600)%60)}`]
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

    tableinfo.push(['APP Port', '' + config.port])

    console.log(tableinfo.map(item => {
      return ' '.repeat(termWidth).center(' '.repeat(width).left(item[0]).right(item[1]));
    }).join('\n'));
  });

}
