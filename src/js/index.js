const path = require('path');
const fs = require('fs');
const process = require('process');

const colors = require('colors');

const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');

const {dir} = require('./context');

// class import
const Template = require('./class/Template');
const Component = require('./class/Component');

// constant variables
const port = process.env.port || 8080;

// express setup
var app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use('/js', serveStatic(path.join(dir, 'static', 'js'), {}));
app.use('/css', serveStatic(path.join(dir, 'static', 'css'), {}));
app.use('/fonts', serveStatic(path.join(dir, 'static', 'fonts'), {}));
app.use('/img', serveStatic(path.join(dir, 'static', 'img'), {}));
// express start
app.listen(port);

// express listeners
app.get('/', (req, res) => {
  res.send(new Template('index').parse());
})
