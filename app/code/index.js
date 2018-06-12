const path          = require('path');
const fs            = require('fs');
const process       = require('process');

const colors        = require('colors');

const mongoose      = require('mongoose');
const passport      = require('passport');
const flash         = require('connect-flash');

const express       = require('express');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const serveStatic   = require('serve-static');
const morgan        = require('morgan');
const session       = require('express-session');

const uid           = require('uid');

const edge          = require('edge.js');

const {
  dir,
  config
  }                 = require('./context');

// require local
const configDB      = require(path.join(dir, 'config', 'database.js'));

// class import
const Template      = require('./class/Template');
const Component     = require('./class/Component');

// MongoDB models

const Document      = require('../models/document');
const User          = require('../models/user');

// constant variables
const port = process.env.port || 8080;

// require('../../config/passport.js')(passport);

// configuration
mongoose.connect(configDB.url);

require('../../config/passport')(passport);

// express setup
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

// edge setup

edge.configure({
  cache: process.env.NODE_ENV === 'production'
})

edge.global('links', function() { return config.links });
edge.global('uid', function() { return uid() });
edge.global('selectIf', function(arr, condition) {
  if(arr instanceof Array) return arr.map(item => {
    if(function() { return eval(condition); }.bind(item)()) return item;
  }).filter(function (n) { return n != undefined });
});
edge.global('path', path);
edge.global('extend', function(obj1, obj2) {
  Object.keys(obj2).forEach(key => {
    console.log(key);
    obj1[key] = obj2[key];
  });
  console.log(obj1)
  return obj1;
})
edge.global('formatDataTags', function(data) {
  return Object.keys(data).map(key => {
    return (key + '="' + data[key] + '"');
  })
})
edge.registerViews(path.join(dir, 'views'));

// express listeners
app.get('/', (req, res) => {
  res.send(edge.render('index'));
});

app.get('/login', (req, res) => {
  res.send(new Template('account/login', {
    message: req.flash('loginMessage')
  }).context(req).render());
});

app.post('/login', passport.authenticate('local-login', {
  successRedirect : '/account/profile', // redirect to the secure profile section
  failureRedirect : '/login', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

app.get('/register', (req, res) => {
  res.send(new Template('account/register', {
    message: req.flash('registerMessage')
  }).context(req).render());
});

app.post('/register', passport.authenticate('local-register', {
  successRedirect : '/account/profile',
  failureRedirect : '/signup',
  failureFlash : true
}));

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

app.get('/account/profile', (req, res) => {
  isLoggedIn(req, res, () => {
    res.send(new Template('account/profile').context(req).render());
  })
});

app.get('/docs/list', (req, res) => {
  let page = req.query.page;
  if(page == undefined) page = 0;

  let query = undefined;
  let sort = {title: 1};

  if(req.query != undefined) {
    if(req.query.name != undefined)
      query.title = req.query.title
    if(req.query.type != undefined)
      query.type = req.query.type
    if(req.query.sort != undefined)
      sort = JSON.parse(req.query.sort)
  }

  Document.find(query).skip(config.docs.itemsPerPage * page).limit(config.docs.itemsPerPage).exec(function(err, docs) {
    res.send(edge.render('docs.list', {items: docs}))

    if(err) {
      res.redirect('/docs/list');
      throw(err);
    }
  });
})

app.get('/docs/edit', (req, res) => {

});

app.post('/docs', (req, res) => {
  if(req.isAuthenticated()) {
    let newDoc = new Document();

    newDoc.title = req.body.title;
    newDoc.type  = req.body.type;
    newDoc.owner = req.user._id;

    console.log(newDoc);

    newDoc.save(function(err) {
      if (err) {
        console.log(err);
        throw err;
        res.send(err);
      }
      res.redirect(`/docs/list?title=${newDoc.title}`)
    })

  } else {
    res.redirect('/docs/list')
  }
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
