// import modules

const {dir, config} = require('../context')

const process       = require('process');
const path          = require('path');
const fs            = require('fs');

const express       = require('express');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const serveStatic   = require('serve-static');
const morgan        = require('morgan');
const session       = require('express-session');
const flash         = require('connect-flash');



module.exports = function(passport, edge) {
  const port = process.env.port || 8080;

  // instanciate app
  var app = express();

  // use plugins
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({ secret: 'yattaneechansugoidesu' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  app.use('/js', serveStatic(path.join(dir, 'static', 'js'), {}));
  app.use('/css', serveStatic(path.join(dir, 'static', 'css'), {}));
  app.use('/fonts', serveStatic(path.join(dir, 'static', 'fonts'), {}));
  app.use('/img', serveStatic(path.join(dir, 'static', 'img'), {}));

  // listen to routes
  require('../routes')(app, passport, edge);

  // start
  app.listen(port);

  console.log(`magic happens on port: ` + port);

  return app;
}
