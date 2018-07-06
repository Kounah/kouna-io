const {def} = require('../fn');

module.exports = function(app, passport, edge) {
  require('./default')(app, passport, edge);
  require('./docs')(app, passport, edge);
  require('./tools')(app, passport, edge);
  require('./bns')(app, passport, edge);
  require('./resources')(app, passport, edge);

  app.get('/*', (req, res) => {
    try {
      res.send(edge.render('page.', req.path.substring(1, req.path.length -1).split('/').join('.'), def({
        context: req
      })))
    } catch(err) {
      res.send(edge.render('page.code.404', def({
        context: req
      })))
    }

  });
}
