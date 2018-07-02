const mongoose = require('mongoose');

const User = require('../models/user');
const Document = require('../models/document');
const BnsChar = require('../models/bnschar')

module.exports = {
  User,
  Document,
  BnsChar
}
