const {BnsChar, User} = require('../../models');
const curl = require('curl');
const querystring = require('querystring');
const moment = require('moment');
const colors = require('colors');

module.exports = function(name, region, callback, options) {
  var query = {
    'general.name': name,
    'region': region
  };
  BnsChar.findOne(query)
  .exec((err, char) => {
    if(char == null
    || (new Date()).getTime() - char.lastMod.getTime() > 30 * 60 * 1000
    || (options && options.forceUpdate == true )) {
      // requires update
      console.log(`${'[BNS]'.blue} ${'getChar'.yellow}: char needs update. NULL ? ${char === null}`);

      let qs  = querystring.stringify({c: name});
      let url = 'http://' + region + '-bns.ncsoft.com/ingame/bs/'
      var profileUrl = url + 'character/profile?' + qs;
      var abilityUrl = url + 'character/data/abilities.json?' + qs;
      var gearUrl    = url + 'character/data/equipments?' + qs;

      curl.get(profileUrl, {}, (perr, pres, pbody) => {
        if(perr) throw perr;
        if(pres.statusCode !== 404) {
          curl.getJSON(abilityUrl, {}, (aerr, ares, adata) => {
            if(aerr) throw aerr;
            if(adata.result !== 'fail') {
              curl.get(gearUrl, {}, (gerr, gres, gbody) => {
                if(gerr) throw gerr;

                char = require('./character-profile-builder')(
                  pbody, adata, gbody, char
                );

                char.region = region;

                char.save(err => {
                  if(err) callback(err, char);
                  callback(null, char);
                })
              })
            }
          })
        }
      })
    } else {
      // just give the one that is already in the db
      console.log(`${'[BNS]'.blue} ${'getChar'.yellow}: char is up tp date`);

      callback(err, char);
    }
  })
}
