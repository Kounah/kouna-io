const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');
const process = require('process');
const color = require('colors');
const shell = require('shelljs')

const dir = path.join(process.argv[1], '..');
const dist = path.join(dir, 'dist');

if(!fs.existsSync(dist)) shell.mkdir('-p', dist);

console.log('building server to' + ('' + dist).cyan);

// execSync(`webpack ${path.join(dir, 'src', 'js', 'index.js')} --target="node" --mode production --output ${path.join(dist, 'main.js')}`, (err, stdout, stderr) => {
//   console.log(stdout);
// }):
