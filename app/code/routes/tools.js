const {def} = require('../fn');

function boxify(o) {
  var
  l       = '\u2574',
  u       = '\u2575',
  r       = '\u2576',
  d       = '\u2577',
  h       = '\u2500',
  v       = '\u2502',
  lu      = '\u256f',
  ld      = '\u256e',
  ru      = '\u2570',
  rd      = '\u256d',
  hu      = '\u2534',
  hd      = '\u252c',
  vl      = '\u2524',
  vr      = '\u251c',
  vh      = '\u253c';
  if(o.text !== undefined) {
    let max = 0;
    let lines = o.text
    .split(/\n/);
    lines.forEach(l => {
      if (l.length > max) max = l.length
    });
    let text = lines.map(l => {
      return v + ' ' + l + ' '.repeat(max - l.length) + ' ' + v
    })
    .join('\n');
    return rd + h.repeat(2 + max) + ld + '\n' + text + '\n' + ru + h.repeat(2 + max) + lu;
  }
}

module.exports = function(app, passport, edge) {
  app.get('/tools/colors', (req, res) => {
    res.send(edge.render('page.tools.colors', def({
      context: req
    })));
  })

  app.get('/tools/box', (req, res) => {
    console.log('notice me sucker')
    if(req.params.text !== undefined) {
      res.send(edge.render('page.tools.box', def({
        context: req,
        result : boxify({
          text: req.query.text
        })
      })));
    } else {
      res.send(edge.render('page.tools.box', def({
        context: req
      })));
    }
  });
}
