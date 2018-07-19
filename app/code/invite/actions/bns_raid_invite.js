const mongoose = require('mongoose');
const {Invite, User} = require('../../db');

module.exports = {
  accept: function(inv) {
    if(inv.data != undefined && inv.data.raidId != undefined) {

    }
  },
  decline: function(inv) {
    if(inv.data != undefined && inv.data.raidId != undefined) {

    }
  }
}
