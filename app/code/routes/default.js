const {dir, config} = require('../context');
const {User} = require('../db');
const uuid = require('uuid/v5');
const path = require('path');
const fs = require('fs');
const {def} = require('../fn')

module.exports = function(app, passport, edge) {
  app.get('/', (req, res) => {
    res.send(edge.render('page.index', {context: req, nav: config.links }));
  });

  app.get('/jquery', (req, res) => {
    res.sendfile(path.join(dir, 'node_modules', 'jquery', 'dist', 'jquery.min.js'));
  })

  app.get('/login', (req, res) => {
    if(!req.isAuthenticated()) {
      res.send(edge.render('page.account.login', def({
        context: req
      })));
    } else {
      res.redirect('/');
    }
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/account/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.get('/register', (req, res) => {
    res.send(edge.render('page.account.register', def({context: req})));
  });

  app.post('/register', passport.authenticate('local-register', {
    successRedirect : '/account/profile',
    failureRedirect : '/register',
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
        res.redirect('/account/profile')
      })
    })
  })
}