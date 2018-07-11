// nodejs start wrapper, will restart process of it exits with code 555
const child_process = require('child_process');
const process = require('process');
const {dir} = require('./app/code/context');
const path = require('path');

function start(nodefile) {
  console.log(nodefile)
  var proc = child_process.spawn('node', [nodefile]);

  // proc.stdout.on('data', function(data) {
  //   process.stdout.write(data)
  // });
  //
  // proc.stderr.on('data', function(data) {
  //   process.stdout.write(data)
  // });

  proc.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    delete(proc);
    // if(code !== 1) {
      setTimeout(function() {
        start(nodefile);
      }, 500);
    // }
  });
}

start(path.join(dir, 'run.js'));
