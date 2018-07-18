const mongoose = require('mongoose');

const User = require('../models/user');
const Document = require('../models/document');
const BnsChar = require('../models/bnschar')
const BnsRaid = require('../models/bnsraid');

module.exports = {
  User,
  Document,
  BnsChar,
  BnsRaid
}
