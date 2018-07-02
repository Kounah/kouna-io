const {def} = require('../fn');

module.exports = function(app, passport, edge) {
  app.get('/tools/colors', (req, res) => {
    res.send(edge.render('page.tools.colors', def({
      context: req
    })));
  })
}
