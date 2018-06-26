const path      = require('path');
const fs        = require('fs');
const process   = require('process');

const colors    = require('colors');
const asciify   = require('asciify');
const uuid      = require('uuid/v5');

const mongoose  = require('mongoose');
const passport  = require('passport');

const {dir, config} = require('./context');
const {def}         = require('./fn')

// require local
const configDB  = require(path.join(dir, 'config', 'database.js'));

// configuration
mongoose.connect(configDB.url);

require('../../config/passport')(passport);

// edge setup
var edge = require('edge.js');
require('./config/edge')(edge);

// express setup
var app = require('./config/express')(passport, edge)

asciify('kouna.io', {font: 'basic'}, function(err, res) { console.log(res.cyan) });
