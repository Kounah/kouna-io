const {def} = require('../fn');
const {BnsChar, User} = require('../db');
const config = require('../bns/config');
const dateFormat = config.char.dateFormat;
const getChar = require('../bns/getChar');


module.exports = function(app, passport, edge) {
  app.get('/bns/profile', (req, res) => {
    if(req.query.region !== undefined
    && req.query.char !== undefined) {
      res.redirect(`/bns/profile/${req.query.region}/${req.query.char}`);
    } else {
      res.send(edge.render('page.bns.profile', def({
        context: req
      })))
    }
  });

  app.get('/bns/profile/:region/:charName', (req, res) => {
    getChar(req.params.charName, req.params.region, (err, char) => {
      if(err) {
        res.send(err);
        throw err;
      }

      if(Object.keys(req.query).length > 0) {
        // console.log('?')
        if(req.query.gist != undefined) {
          res.set('Content-Type', 'text/html')
          res.send(edge.render('component.bns.gist.char', char))
        }
        if(req.query.compact != undefined) {
          res.set('Content-Type', 'text/html')
          res.send(edge.render('component.bns.compact.char', char))
        }
      } else {
        res.send(edge.render('page.bns.profile', def({
          context : req,
          char    : char
        })))
      }
    });
  })

  app.get('/bns/api/data/character/:region/:char', (req, res) => {
    getChar(req.params.char, req.params.region, (err, char) => {
      res.json(char)
    })
  })

  app.get('/bns/list/:region', (req, res) => {
    let query = {};

    console.log(`${'[BNS]'.blue} ${'/list'.magenta} request query: `, req.query);

    var q = {};
    Object.keys(req.query).forEach(key => {
      console.log(key)
      let keys = key.split('-');
      let isArray = req.query[key] instanceof Array;
      console.log(isArray);
      var curQ;
      try {
        console.log(keys, keys.length)
        if(keys[0] === 'c') {
          if(keys.length === 1) return;
          if(keys.length === 2) {
            console.log('cat 2')
            // equals
            if(isArray) {
              curQ = {'$in': req.query[key]}
            } else {
              curQ = req.query[key]
            }
          }
          if(keys.length === 3) {
            if(keys[2] === 'gt') {
              curQ = {'$gt': JSON.parse(req.query[key])}
            }
            if(keys[2] === 'lt') {
              curQ = {'$lt': JSON.parse(req.query[key])}
            }
            if(keys[2] === 'in') {
              curQ = {'$in': req.query[key].split(',')}
            }
            if(keys[2] === 'bt') {
              console.log('cat');
              var m = req.query[key].match(/([0-9]+\.{0,1}[0-9]*),([0-9]+\.{0,1}[0-9]*)/m);
              curQ = {'$gt': parseInt(m[1]), '$lt': parseInt(m[2])}
            }
          }

          q[keys[1]] = curQ;
        }
      } catch (err) { console.log(err.message.red); }
    })

    let page = req.query.page | req.query.p | 0;

    BnsChar.find(q)
    .sort({'general.account': 1, 'general.name': 1})
    .skip(page * config.list.itemsPerPage)
    .limit(config.list.itemsPerPage)
    .exec((err, chars) => {
      res.send(edge.render('page.bns.list', def({
        context: res,
        chars: chars,
        query: q,
        page: page
      })))
    })
  });

  app.get('/bns/list/:region/:name/history', (req, res) => {
    res.sendStatus(404);
    // BnsChar.find({
    //   'region'      : req.params.region,
    //   'general.name': req.params.name
    // }).sort('+date').exec((err, chars) => {
    //   if(err) {
    //     console.log(err);
    //     res.send(err);
    //   }
    //
    //   res.send(edge.render('page.bns.list.history', def({
    //     context: req,
    //     region: req.params.region,
    //     name: req.params.name,
    //     chars: chars
    //   })))
    // })
  })

}
