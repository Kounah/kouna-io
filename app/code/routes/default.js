const {dir, config} = require('../context');
const {User} = require('../db');
const uuid = require('uuid/v5');
const path = require('path');
const fs = require('fs');
const {def} = require('../fn')
const {exec, spawn} = require('child_process');

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

  app.get('/account/settings', (req, res) => {
    if(req.isAuthenticated()) {
      res.send(edge.render('page.account.settings', def({
        context: req
      })))
    } else { res.redirect('/') }
  })

  app.post('/account/settings/ace', (req, res) => {
    if(req.isAuthenticated()) {
      User.findOne({'_id': req.user._id}).exec((err, user) => {
        if(err) {
          console.log(err);
          res.send(err);
          return;
        }

        if(user.settings === undefined) {
          user.settings = {};
        }

        if(user.settings.ace === undefined) {
          user.settings.ace = {}
        }

        user.settings.ace.fontFamily = req.body.fontFamily;
        user.settings.ace.fontSize = req.body.fontSize;
        user.settings.ace.theme = req.body.theme;

        user.save(function (err) {
          if(err) {
            console.log(err);
            res.send(err);
            return;
          }

          res.redirect('/account/settings');
        })
      })
    } else {
      res.redirect('/')
    }
  })

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

  app.get('/admin', (req, res) => {
    if(req.isAuthenticated()) {
      User.findOne({'_id': req.user.id}).exec((err, user) => {
        if(err) {
          res.send(err);
        }

        if(user == undefined) {
          res.sendStatus(403);
          return;
        }

        if(user.admin) {
          res.send(edge.render('page.admin', def({
            context: req
          })));
        } else {
          res.sendStatus(403)
        }
      })
    } else {
      res.sendStatus(401);
    }
  })

  app.get('/admin/:command', (req, res) => {
    if(req.isAuthenticated()) {
      User.findOne({'_id': req.user.id}).exec((err, user) => {
        if(err) {
          res.send(err);
        }

        if(user == undefined) {
          res.sendStatus(403);
          return;
        }

        if(user.admin) {
          console.log(req.params.command)

          switch (req.params.command) {
            case 'update':
              exec(`git -C '${dir}' pull`, (err, stdout, stderr) => {
                res.json({
                  err: err,
                  stdout: stdout,
                  stderr: stderr
                })
              })
              break;
            case 'restart':
              process.exit()
            default:
              res.sendStatus(404);
          }

        } else {
          res.sendStatus(403)
        }
      })
    } else {
      res.sendStatus(401);
    }
  })
}
