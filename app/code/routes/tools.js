const {def} = require('../fn');
const process = require('process');
const boxify = require('../tools/boxify');

module.exports = function(app, passport, edge) {
  app.get('/tools/colors', (req, res) => {
    res.send(edge.render('page.tools.colors', def({
      context: req
    })));
  })

  app.get('/tools/box', (req, res) => {
    if(req.query.text !== undefined) {
      console.log(req.query);
      res.send(edge.render('page.tools.box', def({
        context: req,
        result : boxify({
          text  : req.query.text,
          title : req.query.title,
          ln    : req.query.ln == 'on',
          max   : parseInt(req.query.max) > 0 ? parseInt(req.query.max) : undefined
        })
      })));
    } else {
      res.send(edge.render('page.tools.box', def({
        context: req
      })));
    }
  });

  app.get('/tools/api/box', (req, res) => {
    res.json({
      result : boxify({
        text  : req.query.text,
        title : req.query.title,
        ln    : req.query.ln == 'on',
        max   : parseInt(req.query.max) > 0 ? parseInt(req.query.max) : undefined
      })
    })
  })
}
