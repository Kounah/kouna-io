const path = require('path');
const Template = require('./class/Template');
const Component = require('./class/Component');

module.exports = function(app, passport) {
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

  // app.post('/register', (...params) => {
  //   console.log(params);
  //
  //   passport.authenticate('local-register', {
  //     successRedirect : '/profile',
  //     failureRedirect : '/signup',
  //     failureFlash : true
  //   })(params);
  // });

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
}

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}
