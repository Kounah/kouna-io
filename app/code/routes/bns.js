const {def} = require('../fn')
const {BnsChar, User} = require('../db')
const curl = require('curl');

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
        let url = 'http://' + region + '-bns.ncsoft.com/ingame/bs/'
        var profileUrl = url + 'character/profile?c=' + name;
        var abilityUrl = url + 'character/data/abilities.json?c=' + name
        var gearUrl    = url + 'character/data/equipments?c=Kouna'
        curl.get(profileUrl, {}, function(profileErr, profileResponse, profileBody) {
          if(err) throw err;

          if(profileResponse.statusCode === 404) {

          } else {
            curl.getJSON(abilityUrl, {}, function(abilityErr, abilityResponse, abilityData) {
              if(abilityResponse.statusCode === 404) {

              } else {
                curl.get(gearUrl, {}, function(gearErr, gearResponse, gearData) {
                  if(gearResponse.statusCode === 404) {

                  } else {
                    let char = require('../bns/character-profile-builder')(profileBody, abilityData, gearData);

                    console.log(char);

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
    res.send(edge.render('page.bns.profile', def({
      context: req
    })))
  });

  app.get('/bns/profile/:char', (req, res) => {
    res.send(edge.render('page.bns.profile', def({
      context: req
    })))
  })

  app.get('/bns/api/data/character/:region/:char', (req, res) => {
    getCharByName(req.params.char, req.params.region, char => {
      res.json(char)
    })
  })
}
