const {def} = require('../fn');
const {BnsRaid, BnsChar, User} = require('../db');
const config = require('../bns/config');
const dateFormat = config.char.dateFormat;
const getChar = require('../bns/getChar');
const {dumpKeysRecursively} = require('recursive-keys')
const ObjectId = require('mongodb').ObjectId;

function handleError(err) {
  if(err)
    console.log(err);
}

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

  app.get('/bns/list', (req, res) => {
    res.send(edge.render('page.bns.list_no_region', def({
      context: req,
    })));
  })

  app.get('/bns/list/:region', (req, res) => {
    let query = {};
    console.log(`${'[BNS]'.blue} ${'/list'.magenta} request query: `, req.query);
    var q = {};
    Object.keys(req.query).forEach(key => {
      let keys = key.split('-');
      let isArray = req.query[key] instanceof Array;
      var curQ;
      try {
        if(keys[0] === 'c') {
          if(keys.length === 1) return;
          if(keys.length === 2) {
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
              var m = req.query[key].match(/([0-9]+\.{0,1}[0-9]*),([0-9]+\.{0,1}[0-9]*)/m);
              curQ = {'$gt': JSON.parse(m[1]), '$lt': JSON.parse(m[2])}
            }
          }
          q[keys[1]] = curQ;
        }
      } catch (err) { console.log(err.message.red); }
    })

    let page = req.query.page | req.query.p | 0;

    console.log(q);

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

  app.get('/bns/api/keys/char', (req, res) => {
    BnsChar.findOne({}, (err, char) => {
      function f(x) {
        var o = {};
        dumpKeysRecursively(x).forEach(key => {
          o[key] = null;
        })
        return o;
      }

      var o = char['_doc'];
      delete o._id;
      delete o.__v;
      res.send(f(o))
    })
  })

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

  // RAID SECTION

  app.get('/bns/raid', (req, res) => {
    if(req.isAuthenticated()) {
      BnsRaid.find({members: req.user._id}).exec((err, raids) => {
        handleError(err);

        res.send(edge.render('page.bns.raid', def({
          context: req,
          raids: raids
        })))
      })
    } else {
      res.send(edge.render('page.bns.raid', def({
        context: req
      })))
    }
  });

  app.post('/bns/raid', (req, res) => {
    if(req.isAuthenticated()) {
      var raid = new BnsRaid();
      raid.createdOn = new Date();
      raid.creator = req.user._id + '';
      raid.members.push(req.user._id + '');
      raid.editors.push(req.user._id + '');
      raid.name = req.body.name;
      raid.description = req.body.description;

      raid.save((err, newRaid) => {
        handleError(err);

        res.redirect('/bns/raid')
      })
    } else {
      res.sendStatus(401);
    }
  })

  function raidCharInfo(raid, memberId) {
    return raid.characters.map((raidChar, raidCharIndex) => {
      if(raidChar.userId == memberId) {
        return {
          character: raidChar,
          groups: raid.groups.map((group, groupIndex) => {
            var matchingClassifications = group.classifications.filter(d => {return d.charIndex == raidCharIndex});
            if(matchingClassifications.length > 0) {
              return {
                title: group.title,
                subtitle: group.subtitle,
                plannedfor: group.plannedfor,
                classifications: matchingClassifications.map((classif, classifId) => {
                  return {
                    character: raid.characters[classif.charIndex],
                    roles: classif.roles.map(role => {
                      return group.roles[role];
                    })
                  }
                })
              }
            } else {
              return null;
            }
          }).filter(d => {return d != null})
        }
      } else {
        return null;
      }
    }).filter(d => {return d != null})
  }

  app.get('/bns/raid/:raidId/member/:memberId/detail', (req, res) => {
    if(req.isAuthenticated()) {
      BnsRaid.findById(req.params.raidId).exec((err, raid) => {
        handleError(err);

        if(raid != undefined) {
          if(raid.members.includes(req.params.memberId)) {
            var result = raidCharInfo(raid, req.params.memberId);

            res.send(edge.render('page.bns.raid.memberdetail', def({
              context: req,
              data: result,
              raidId: req.params.raidId,
              memberId: req.params.memberId
            })))
          } else {
            res.sendStatus(403);
          }
        } else {
          res.sendStatus(404);
        }
      })
    } else {
      res.sendStatus(401);
    }
  })

  app.post('/bns/raid/:raidId/member/:memberId/character', (req, res) => {
    if(req.isAuthenticated()) {
      BnsRaid.findById(req.params.raidId).exec((err, raid) => {
        handleError(err);

        if(raid != undefined) {
          if(raid.editors.includes('' + req.user._id)) {
            getChar(req.body.characterName, req.body.characterRegion, (err, char) => {
              handleError(err);

              raid.characters.push({
                userId: req.params.memberId,
                bnsCharId: '' + char._id
              })

              raid.save((err, newRaid) => {
                handleError(err);

                res.redirect('/bns/raid')
              })
            })
          } else {
            res.sendStatus(403)
          }
        } else {
          res.sendStatus(404)
        }
      })
    } else {
      res.sendStatus(401)
    }
  })

  function removeRaidCharacter(req, res) {
    if(req.isAuthenticated()) {
      BnsRaid.findById(req.params.raidId).exec((err, raid) => {
        handleError(err);

        if(raid != undefined) {
          if(raid.editors.includes('' + req.user._id)) {

            var ri = [];
            raid.characters = raid.characters.filter((d, fi) => {
              if(d._id + '' != req.params.characterId) {
                return true;
              } else {
                ri.push(fi);
                return false;
              }
            })

            raid.groups.forEach((g, gi) => {
              raid.groups[gi].classifications = raid.groups[gi].classifications.filter(d => {
                return !ri.includes(d.charIndex)
              })
            })

            raid.save((err, newRaid) => {
              handleError(err);

              res.redirect('/bns/raid')
            })
          } else {
            res.sendStatus(403)
          }
        } else {
          res.sendStatus(404)
        }
      })
    } else {
      res.sendStatus(401)
    }
  }

  app.delete('/bns/raid/:raidId/member/:memberId/character/:characterId', (req, res) => {
    removeRaidCharacter(req, res);
  })

  app.post('/bns/raid/:raidId/member/:memberId/character/:characterId/remove', (req, res) => {
    removeRaidCharacter(req, res);
  })

  app.get('/bns/char/id/:id', (req, res) => {
    BnsChar.findOne({_id: '' + req.params.id}).select('region general').exec((err, char) => {
      res.json(char);
    })
  })

}
