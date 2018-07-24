const path          = require('path');

const colors        = require('colors');

const mongoose      = require('mongoose');
const passport      = require('passport');

const {dir, config} = require('./context');

const meta          = require('./meta');

const configDB      = require('../../config/database');

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

app.listen(config.port);

// other

require('./welcome')()
