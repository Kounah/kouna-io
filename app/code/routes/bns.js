const {def} = require('../fn');
const {BnsChar, User} = require('../db');
const config = require('../bns/config');
const curl = require('curl');
const querystring = require('querystring');
const moment = require('moment');


const dateFormat = config.char.dateFormat;

module.exports = function(app, passport, edge) {
  function getCharByName(name, region, callback, options) {
    if(name == undefined || name == 'undefined' || region == undefined || callback == undefined) {
      console.log('friggin wrong params');
      callback(undefined, undefined);
      return;
    }

    var q = {'general.name': name, 'region': region, 'date': moment().format(dateFormat)};

    console.log(q);

    if(!['eu', 'na'].includes(region)) {
      callback(null);
      return;
    }

    BnsChar.count(q, (err, count) => {
      if(err) {
        console.log(err);
        return;
      }

      if(count <= 0) {
        console.log('found none');

        let qs  = querystring.stringify({c: name});
        console.log(qs)
        let url = 'http://' + region + '-bns.ncsoft.com/ingame/bs/'
        var profileUrl = url + 'character/profile?' + qs;
        var abilityUrl = url + 'character/data/abilities.json?' + qs;
        var gearUrl    = url + 'character/data/equipments?' + qs;
        curl.get(profileUrl, {}, function(profileErr, profileResponse, profileBody) {
          if(err) throw err;

          if(profileResponse.statusCode === 404) {

          } else {
            curl.getJSON(abilityUrl, {}, function(abilityErr, abilityResponse, abilityData) {
              if(abilityData.result === 'fail') {

              } else {
                curl.get(gearUrl, {}, function(gearErr, gearResponse, gearData) {
                  if(gearErr) {
                    console.log(gearErr)
                  } else {
                    let char = require('../bns/character-profile-builder')(profileBody, abilityData, gearData);

                    char.region = region;
                    char.date   = moment().format(dateFormat);

                    BnsChar.findOne({
                      'region'          : char.region,
                      'general.account' : char.general.account,
                      'general.name'    : char.general.name,
                      'date'            : moment().format(dateFormat)
                    }).exec((err, existingChar) => {
                      if(err) {
                        console.log(err);
                        callback(err, char);
                        return;
                      }

                      if(existingChar !== null) {
                        if(options && options.forceUpdate === true) {
                          existingChar = char;
                          existingChar.save(err => {
                            if(err) {
                              console.log(err);
                              callback(err, existingChar)
                              return;
                            }

                            callback(undefined, existingChar)
                          })
                        }
                      } else {
                        char.save(err => {
                          if(err) {
                            console.log(err);
                            callback(err, char);
                            return;
                          }

                          callback(undefined, char)
                        })
                      }
                    })

                    // callback(undefined, char);
                  }
                })
              }
            })
          }
        })
      } else {
        console.log('found ' + count);

        BnsChar.find(q).exec((err, chars) => {
          if(err) {
            console.log(err);
            callback(err, undefined);
            return;
          }

          var latest  = undefined;
          var latestI = 0;
          chars.forEach((c, i) => {
            if(latest == undefined) {
              latest = moment(c.date, dateFormat);
            } else {
              if(moment(c.data, dateFormat).isAfter(latest)) {
                latestI = i;
                latest  = moment(c.date, dateFormat)
              }
            }
          })

          callback(undefined, chars[latestI])
        });
      }
    })
  }


  app.get('/bns/profile', (req, res) => {
    console.log(req.query);
    if(req.query.region !== undefined
    && req.query.char !== undefined) {
      res.redirect(`/bns/profile/${req.query.region}/${req.query.char}`);
    } else {
      res.send(edge.render('page.bns.profile', def({
        context: req
      })))
    }
  });

  app.get('/bns/profile/:region', (req, res) => {
    res.sendStatus(404);
  })

  app.get('/bns/profile/:region/:charName', (req, res) => {
    console.log(req.params);

    getCharByName(req.params.charName, req.params.region, (err, char) => {
      if(err) {
        res.send(err);
        throw err;
      }

      if(char) {
        console.log(char)
      }

      console.log(req.query);
      if(req.query && req.query.compact != undefined) {
        res.send(edge.render('component.bns.compact.char', char))
      } else {
        res.send(edge.render('page.bns.profile', def({
          context : req,
          char    : char
        })))
      }
    });
  })

  app.get('/bns/api/data/character/:region/:char', (req, res) => {
    getCharByName(req.params.char, req.params.region, (err, char) => {
      res.json(char)
    })
  })

  app.get('/bns/list/:region/:name/history', (req, res) => {
    BnsChar.find({
      'region'      : req.params.region,
      'general.name': req.params.name
    }).sort('+date').exec((err, chars) => {
      if(err) {
        console.log(err);
        res.send(err);
      }

      res.send(edge.render('page.bns.list.history', def({
        context: req,
        region: req.params.region,
        name: req.params.name,
        chars: chars
      })))
    })
  })
}
