const path      = require('path');
const fs        = require('fs');
const process   = require('process');

const colors    = require('colors');
const asciify   = require('asciify');
const uuid      = require('uuid/v5');

const mongoose  = require('mongoose');
const passport  = require('passport');

const {dir, config} = require('./context');
const {def}         = require('./fn')

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
app.use(session({ secret: 'yattaneechansugoidesu' }));
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

console.log(`magic happens on port: ` + port);

// other

var creativeText = 'Some creative text will be added here as soon as I made one up.'

text: asciify('kouna.io', {font: 'univers'}, function(err, res) {
  console.log(require('./tools/boxify')({
    text: res + '\n' + ('\u259e'.repeat(res.split('\n')[0].length) + '\n').repeat(3) + '\n' + creativeText,
    title: 'Welcome',
    ln: true,
    // max: res.split('\n')[0].length
  }).rainbow.bold)
});
