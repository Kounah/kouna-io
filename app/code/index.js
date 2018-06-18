const path      = require('path');
const fs        = require('fs');
const process   = require('process');

const colors    = require('colors');
const asciify   = require('asciify');
const uuid      = require('uuid/v5');

const mongoose  = require('mongoose');
const passport  = require('passport');
const flash     = require('connect-flash');

const express       = require('express');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const serveStatic   = require('serve-static');
const morgan        = require('morgan');
const session       = require('express-session');

const {dir, config} = require('./context');

// require local
const configDB  = require(path.join(dir, 'config', 'database.js'));

// class import
const Template  = require('./class/Template');
const Component = require('./class/Component');

// mongodb models

const {User, Document} = require('./db');

// constant variables
const port = process.env.port || 8080;

// require('../../config/passport.js')(passport);

// configuration
mongoose.connect(configDB.url);

require('../../config/passport')(passport);

// edge setup
var edge = require('edge.js');
edge.registerViews(path.join(dir, './views'));

edge.global('eval', function(code) {
  return code;
})

edge.global('filterArray', function(arr, cond) {
  var result = [];

  arr.forEach(function(a) {
    if((function() { return eval(cond) }.bind(a))()) {
      result.push(a)
    }
  });

  return result;
})

edge.global('uuid', function(o) {
  return uuid(JSON.stringify(o), config.NAMESPACE_UUID)
})

function def(o) {
  let result = {};
  let copyFrom = [{
    nav: config.links
  }];
  copyFrom.push(o);
  copyFrom.forEach(item => {
    Object.keys(item).forEach(key => {
      result[key] = item[key];
    })
  })
  return result;
}

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

// express listeners
app.get('/', (req, res) => {
  res.send(edge.render('page.index', {context: req, nav: config.links }));
});

app.get('/jquery', (req, res) => {
  res.sendfile(path.join(dir, 'node_modules', 'jquery', 'dist', 'jquery.min.js'));
})

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

app.get('/user/:userid/short', (req, res) => {
  if(req.isAuthenticated()) {
    User.findOne({'_id': req.params.userid}).select('local.name local.email').exec((err, user) => {
      console.log(user);

      res.json(user);
    })
  } else {
    res.send(401);
  }
})

app.get('/account/profile', (req, res) => {
  if(req.isAuthenticated()) {
    res.send(edge.render('page.account.profile', def({
      context: req
    })))
  } else { res.redirect('/') }
});


app.post('/account/edit', (req, res) => {
  User.findById(req.user._id, (err, user) => {
    if(err)
      throw err;

    if(req.body.name != undefined)
      user.set({'local.name': req.body.name});

    user.save((err, updatedUser) => {
      res.send(new Template('account/profile').context(req).render());
    })
  })
})

app.get('/docs/list', (req, res) => {
  let page = req.query.page;
  if(page == undefined) page = 0;

  let query = {};
  let sort = {title: 1};

  if(req.query != undefined) {
    if(req.query.title != undefined)
      query.title = req.query.title
    if(req.query.type != undefined)
      query.type = req.query.type
    if(req.query.sort != undefined)
      sort = JSON.parse(req.query.sort)
  }

  Document.find().exec(function(err, docs) {
    console.log(docs);
  })

  Document.find(query).skip(config.docs.itemsPerPage * page).limit(config.docs.itemsPerPage).exec(function(err, docs) {
    if(err) {
      res.redirect('/docs/list');
      throw(err);
    }

    res.send(edge.render('page.docs', def({docs: docs, page: page, context: req, types: config.docs.types, colors: config.docs.colors})));
  });
})

app.get('/docs/preview/:docId', (req, res) => {
  res.send(fs.readFileSync(path.join(dir, 'static', 'img', 'coming-soon.png')))
});


app.get('/docs/edit', (req, res) => {

});

app.post('/docs', (req, res) => {
  if(req.isAuthenticated()) {
    let newDoc = new Document();

    console.log(req.user._id);

    newDoc.title          = req.body.title;
    newDoc.topic          = req.body.topic;
    newDoc.description    = req.body.description;
    newDoc.type           = req.body.type;
    newDoc.color          = req.body.color;
    newDoc.creator        = req.user._id;

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

asciify('kouna.io', {font: 'basic'}, function(err, res) { console.log(res.cyan) });
