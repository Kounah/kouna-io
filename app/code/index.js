const path      = require('path');
const fs        = require('fs');
const process   = require('process');

const colors    = require('colors');

const mongoose  = require('mongoose');
const passport  = require('passport');
const flash     = require('connect-flash');

const express       = require('express');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const serveStatic   = require('serve-static');
const morgan        = require('morgan');
const session       = require('express-session');

const {dir} = require('./context');

// require local
const configDB  = require(path.join(dir, 'config', 'database.js'));

// class import
const Template  = require('./class/Template');
const Component = require('./class/Component');

// constant variables
const port = process.env.port || 8080;

// require('../../config/passport.js')(passport);

// configuration
mongoose.connect(configDB.url);

require('../../config/passport')(passport);

// express setup
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ secret: 'yattaneechansugeudesu'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/js', serveStatic(path.join(dir, 'static', 'js'), {}));
app.use('/css', serveStatic(path.join(dir, 'static', 'css'), {}));
app.use('/fonts', serveStatic(path.join(dir, 'static', 'fonts'), {}));
app.use('/img', serveStatic(path.join(dir, 'static', 'img'), {}));

// express listeners
app.get('/', (req, res) => {
  res.send(new Template('index').context(req).render());
});

app.get('/login', (req, res) => {
  res.send(new Template('account/login', {
    message: req.flash('loginMessage')
  }).context(req).render());
});

// app.post('/login', (req, res) => {
//
// });

app.get('/register', (req, res) => {
  res.send(new Template('account/register', {
    message: req.flash('registerMessage')
  }).context(req).render());
});

app.post('/register', passport.authenticate('local-register', {
  successRedirect : '/profile',
  failureRedirect : '/signup',
  failureFlash : true
}));

app.get('/account', (req, res) => {
  res.send(new Template('account/overview', {
    user: req.user
  }).context(req).render());
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

app.get('/*', (req, res) => {
  res.send(new Template(req.path.substring(1, req.path.length), {

  }).context(req).render());
});

// express start
app.listen(port);


function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}

console.log(`magic happens on port: ` + port);
