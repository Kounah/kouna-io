
const mongoose = require('mongoose');

const User = require('../models/user');
const Document = require('../models/document');
const BnsChar = require('../models/bnschar');
const BnsRaid = require('../models/bnsraid');
const Invite = require('../models/invite');

const colors = require('colors');

console.log('[deprecated warning]'.yellow, 'please require the models module directly from its module folder [app/models]', new Error().stack);

module.exports = {
  User,
  Document,
  BnsChar,
  BnsRaid,
  Invite
}
