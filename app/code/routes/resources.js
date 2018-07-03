const path = require('path');
const fs = require('fs');
const {config} = require('../context');
const {def} = require('../fn');

module.exports = function (app, passport, edge) {
  console.log(config.ace);

  app.get('/ace/info', (req, res) => {
    res.send(edge.render('page.ace.info', def({
      context: req,
      modules: config.ace.modules
    })));
  })

  app.get('/ace', (req, res) => {
    res.sendFile(path.join(config.ace.path, 'ace.js'))
  })

  app.get('/ace/module/:type/:name', (req, res) => {
    console.log(req.params);
    if(req.params.type && req.params.name) {
      let p = path.join(config.ace.path, `${req.params.type}-${req.params.name}.js`);
      if(fs.existsSync(p)) {
        res.sendFile(p);
      } else {
        res.sendStatus(404);
      }
    } else {
      res.sendStatus(404);
    }
  })
}
