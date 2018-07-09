String.prototype.centerInsert = function (text) {
  if(text.length > this.length) {
  } else {
    var leftIndex = Math.floor(this.length / 2) - Math.floor(text.length / 2);
    return this.substring(0, leftIndex) + text + this.substring(leftIndex + text.length, this.length);
  }
}

module.exports = function(o) {
  var
  sl      = ' ',
  sr      = ' ',
  l       = '\u2574',
  u       = '\u2575',
  r       = '\u2576',
  d       = '\u2577',
  h       = '\u2500',
  v       = '\u2502',
  lu      = '\u2518',
  ld      = '\u2510',
  ru      = '\u2514',
  rd      = '\u250c',
  hu      = '\u2534',
  hd      = '\u252c',
  vl      = '\u2524',
  vr      = '\u251c',
  vh      = '\u253c';

  function splitLineByMax(l, ln, lnDummy, max) {
    let com = "";
    let cur = "";

    l.split(' ').forEach((w, wi) => {
      if(w.length > max) {
        com += cur + '\n';
        cur  = '';

        let rep = Math.trunc(w.length / max);
        if(w.length % max != 0) rep++;

        for(i = 0; i < rep; i++) {
          com += w.substring(i*max, (i+1)*max) + '\n';
        }
      } else {
        if(cur.length + w.length < max) {
          cur += (cur != '' && wi > 0 ? ' ' : '') + w;
        } else {
          com += cur + '\n';
          cur  = w;
        }
      }
    })

    if(cur != '') com += cur;

    return com.split(/\n|\r\n/).map((cl, cli) => {
      return v + (cli > 0 ? lnDummy : ln) + sl + cl + ' '.repeat(max - cl.length) + sr + v;
    }).join('\n');
  }

  if(o.text !== undefined) {
    let max = 0;
    let lines = o.text
    .split(/\n|\r\n/);
    lines.forEach(l => {
      if (l.length > max) max = l.length
    });

    var limit = undefined;
    if(o.max === undefined) {
      if(max > process.stdout.columns) {
        max = process.stdout.columns - 2 - sl.length + sr.length;
        limit = process.stdout.columns;
      }
    } else {
      if(max > o.max) {
        max = o.max;
        limit = o.max;
      }
    }

    if(o.ln === true) {
      o.lnLength = ('' + (lines.length + 1)).length;
      if(limit != undefined) {
        max = limit - o.lnLength - 3 - sr.length - sl.length;
      }
    }

    let text = lines.map((l, li) => {
      var ln = o.ln === true ? (' '.repeat(o.lnLength - ('' + li).length) + li + v) : '';
      var lnDummy = o.ln === true ? (' '.repeat(o.lnLength - 1) + '•' + v) : '';

      if(l.length > max + (o.lnLength ? o.lnLength : 0) + 1) {
        return splitLineByMax(l, ln, lnDummy, max)
      } else {
        return v + ln + sl + l + ' '.repeat(max - l.length) + sr + v;
      }
    })
    .join('\n');

    var title = '';
    if(o.title) {
      if(o.title.length > max + sl.length + sr.length + o.lnLength + 1) {
        o.title = o.title.substring(0, (max + sl.length + sr.length + o.lnLength + 1) -3) + '...';
      }
      title = rd + h.repeat(max + sl.length + sr.length + o.lnLength + 1) + ld + '\n'+
      v + ' '.repeat((max + sl.length + sr.length + o.lnLength + 1)).centerInsert(o.title) + v;
    }

    return '' + title + '\n'
    + (title === '' ? rd : vr)
    + (o.ln === true ? (h.repeat(o.lnLength) + hd) : '')
    + (h.repeat(sl.length + sr.length + max))
    + (title === '' ? ld : vl) + '\n'
    + text + '\n'
    + ru + (o.ln === true ? (h.repeat(o.lnLength) + hu) : '') + h.repeat(sl.length + sr.length + max) + lu;
  }
}
