const {User, Notification} = require('../models');

function sendNotification(params) {
  if(params.from && params.to && params.body) {

  }
}

module.exports = {
  sendNotification,
}
