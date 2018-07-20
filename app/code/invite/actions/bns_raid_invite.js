const mongoose = require('mongoose');
const {Invite, User, BnsRaid} = require('../../../models');
const notif = require('../../notif');

function handleError(err) {
  if(err) {
    console.log(err)
  }
}

function accept(inv, callback) {
  if(inv.data != undefined && inv.data.raidId != undefined) {
    BnsRaid.findById(inv.data.raidId).exec((err, raid) => {
      handleError(err);
      if(!raid.members.includes(inv.to)) {
        raid.members.push(inv.to);

        User.findById(inv.from).exec((err, fromUser) => {
          handleError(err);
          User.findById(inv.to).exec((err, toUser) => {
            handleError(err);
            if(fromUser != undefined && toUser != undefined) {
              notif.sendNotification({
                from  : toUser._id,
                to    : fromUser._id,
                body  : `${toUser.local.name} has accepted you invite to ${raid.name}`,
                data  : {}
              })

              raid.save((err, newRaid) => {
                handleError(err);
              })

              callback(`**Invitation Accepted:** ${raid.name}`)
            }
          })
        })

        Invite.deleteOne({_id: inv._id}, (err) => {
          handleError(err)
        });
      } else {
        callback('**Congratulations,** you invited yourself and accepted it.')


        Invite.deleteOne({_id: inv._id}, (err) => {
          handleError(err)
        });
      }
    })
  }
}

function decline(inv, callback) {
  if(inv.data != undefined && inv.data.raidId != undefined) {
    BnsRaid.findById(inv.data.raidId).exec((err, raid) => {
      handleError(err);
      User.findById(inv.from).exec((err, fromUser) => {
        handleError(err);
        User.findById(inv.to).exec((err, toUser) => {
          handleError(err);
          if(fromUser != undefined && toUser != undefined) {
            notif.sendNotification({
              from  : toUser._id,
              to    : fromUser._id,
              body  : `${toUser.local.name} has declined your invite to ${raid.name}`,
              data  : {}
            })

            callback(`**Invitation Declined:** ${raid.name}`)
          }
        })
      })

      Invite.deleteOne({_id: inv._id}, (err) => {
        handleError(err)
      });
    })
  }
}

module.exports = {
  accept,
  decline
}
