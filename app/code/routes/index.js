const {def} = require('../fn');

module.exports = function(app, passport, edge) {
  require('./default')(app, passport, edge);
  require('./docs')(app, passport, edge);
  require('./tools')(app, passport, edge);
  require('./bns')(app, passport, edge);
  require('./resources')(app, passport, edge);

  app.get('/*', (req, res) => {
    res.send(edge.render('page.code.404', def({
      context: req
    })))
  });
}
