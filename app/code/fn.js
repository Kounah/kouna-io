const {dir, config} = require('./context');

function def(o) {
  let result = {};

  let copyFrom = [{
    nav: config.links
  }];


// .filter(d => d.type == 'theme')
  copyFrom.push(o);
  copyFrom.forEach(item => {
    Object.keys(item).forEach(key => {
      result[key] = item[key];
    })
  })
  return result;
}

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}

module.exports = {
  def,
  isLoggedIn
}
