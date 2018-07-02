const {def} = require('../fn')
const {BnsChar, User} = require('../db')
const curl = require('curl');
<<<<<<< HEAD
const querystring = require('querystring');
=======
>>>>>>> 8f156a481bab563698229615a9513982314b80b5

module.exports = function(app, passport, edge) {
  function getCharByName(name, region, callback) {
    var q = {'general.name': name};

    console.log(q);

    if(!['eu', 'na'].includes(region)) {
      callback(null);
      return;
    }

    BnsChar.count(q, (err, count) => {
      if(err)
        throw err;

      if(count <= 0) {
<<<<<<< HEAD
        let qs  = querystring.stringify({c: name});
        console.log(qs)
        let url = 'http://' + region + '-bns.ncsoft.com/ingame/bs/'
        var profileUrl = url + 'character/profile?' + qs;
        var abilityUrl = url + 'character/data/abilities.json?' + qs;
        var gearUrl    = url + 'character/data/equipments?' + qs;
=======
        let url = 'http://' + region + '-bns.ncsoft.com/ingame/bs/'
        var profileUrl = url + 'character/profile?c=' + name;
        var abilityUrl = url + 'character/data/abilities.json?c=' + name
        var gearUrl    = url + 'character/data/equipments?c=Kouna'
>>>>>>> 8f156a481bab563698229615a9513982314b80b5
        curl.get(profileUrl, {}, function(profileErr, profileResponse, profileBody) {
          if(err) throw err;

          if(profileResponse.statusCode === 404) {

          } else {
            curl.getJSON(abilityUrl, {}, function(abilityErr, abilityResponse, abilityData) {
              if(abilityData.result === 'fail') {

              } else {
                curl.get(gearUrl, {}, function(gearErr, gearResponse, gearData) {
                  if(gearResponse.statusCode === 404) {

                  } else {
                    let char = require('../bns/character-profile-builder')(profileBody, abilityData, gearData);

                    char.region = region;

                    callback(char);
                  }
                })
              }
            })
          }
        })
      } else {
        BnsChar.findOne({'general.name': name}, char => {
          callback(char);
        });
      }
    })
  }

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

  app.get('/bns/profile/:region/:char', (req, res) => {
    getCharByName(req.params.char, req.params.region, char => {
      res.send(edge.render('page.bns.profile', def({
        context : req,
        char    : char
      })))
    })
  })

  app.get('/bns/api/data/character/:region/:char', (req, res) => {
    getCharByName(req.params.char, req.params.region, char => {
      res.json(char)
    })
  })
}
