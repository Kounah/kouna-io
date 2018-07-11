const Link = require('../../models/link');

module.exports = function(app, passport, edge) {
  app.post('/l', (req, res) => {
    console.log('query', req.query)
    console.log('body', req.body)
    console.log('params', req.params)

    var l       = new Link();
    l.url       = req.body.url | req.query.url | '/';
    l.timestamp = new Date();
    Link.count({}, (err, count) => {
      if(err) {
        console.log(err.message.red);
        res.send(err);
        return;
      }

      l.short = count;

      l.save((err) => {
        if(err) {
          console.log(err);
          res.send(err);
          return;
        }

        res.json({
          url: {
            long: l.url,
            short: 'kouna.io:8080/l/' + l.short
          }
        });
      })
    })
  })

  app.get('/l/:linkid', (req, res) => {
    Link.findOne({
      short: req.params.linkid
    }).exec((err, link) => {
      if(err) {
        return;
      }

      if(link == undefined) {
        res.redirect('/')
      } else {
        res.redirect(link.url);
      }
    })
  })
}
