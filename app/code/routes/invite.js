const {Invite, User} = require('../db');
const moment = require('moment');

function handleError(err) {
  if(err) {
    console.log(err);
  }
}

module.exports = function (app, edge, passport) {
  app.post('/invite/send', (req, res) => {
    if(req.isAuthenticated()) {
      User.findById(req.user._id).exec((err, fromUser) => {
        handleError(err);

        var inv = new Invite();

        if(fromUser == undefined) {
          res.sendStatus(401);
        } else {
          inv.from = fromUser._id + '';

          if(req.body && req.body.to) {
            User.findOne({'local.email': req.body.to}).exec((err, toUser) => {
              handleError(err);

              if(toUser == undefined) {
                res.sendStatus(400);
              } else {
                inv.to = toUser._id + '';

                if(req.body && req.body.type) {
                  inv.type = req.body.type;
                } else {
                  res.sendStatus(400)
                }

                if(req.body && req.body.data) {
                  inv.data = req.body.data;
                }

                var q = {
                  from: inv.from,
                  to: inv.to,
                  data: inv.data,
                  type: inv.type
                };

                console.log(q);

                Invite.find(q).exec((err, invites) => {
                  if(invites.length > 0) {
                    res.json({
                      success: false,
                      message: 'you may only send one invite to a user',
                      result: invites
                    })
                  } else {

                    inv.createdOn = new Date();
                    inv.save((err, newInv) => {
                      handleError(err);

                      res.json({
                        success: true,
                        message: 'Success, an Invite has been send to ' + toUser.local.name,
                        result: newInv
                      });
                    })
                  }
                })
              }
            })
          } else {
            res.sendStatus(400);
          }
        }
      })
    } else {
      res.sendStatus(401);
    }
  })

  app.get('/invites', (req, res) => {
    if(req.isAuthenticated()) {
      User.findById(req.user._id).exec((err, user) => {
        handleError(err);

        if(user == undefined) {
          res.sendStatus(401)
        } else {
          let q = {
            to: user._id
          }


          Invite.find({to: user._id}).exec((err, invites) => {
            var inv = invites;
            if(req.query && req.query.after) {
              inv = invites.filter(d => {
                return moment(req.query.after).isBefore(moment(d.createdOn));
              })
            }
            res.json({
              success: inv != undefined,
              message: '',
              result : inv
            });
          })
        }

      })
    } else {
      res.sendStatus(401)
    }
  })

  app.post('/invite/:inviteId/:action', (req, res) => {
    if(req.isAuthenticated()) {
      User.findOne({_id: req.user._id}).exec((err, user) => {
        handleError(err);

        if(user == undefined) {
          res.sendStatus(401);
        } else {
          Invite.findById(req.params.inviteId).exec((err, invite) => {
            handleError(err);

            if(invite == undefined) {
              res.sendStatus('400');
            } else {

            }
          })
        }
      })
    } else {
      res.sendStatus(401);
    }
  })
}
