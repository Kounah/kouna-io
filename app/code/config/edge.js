const {dir, config} = require('../context');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v5');

module.exports = function(edge) {
  edge.registerViews(path.join(dir, './views'));

  edge.global('eval', function(code) {
    return eval(code);
  })

  edge.global('filterArray', function(arr, cond) {
    var result = [];

    arr.forEach(function(a) {
      if((function() { return eval(cond) }.bind(a))()) {
        result.push(a)
      }
    });

    return result;
  })

  edge.global('config', function() {
    return config;
  })

  edge.global('concatenate', function(arr) {
    return arr.join('');
  })

  edge.global('uuid', function(o) {
    return uuid(JSON.stringify(o), config.NAMESPACE_UUID)
  })

  edge.global('toFileIcon', function(docType) {
    return config.docs.fileIcons[docType];
  })

  edge.global('propertyRange', function(o) {
    return Object.keys(o).map(key => {
      return {
        key:    key,
        value:  o[key]
      }
    });
  })

  edge.global('getPercentage', function(cur, max) {
    return ((cur / max) * 100) + '%';
  })

  edge.global('renderDoc', function(doc) {
    switch(doc.type) {
      case 'markdown':
          return require('../markdown').render(doc.content);
        break;
      default:
        return doc.content;
    }
  })

  edge.global('renderMarkdown', function(markdown) {
    return require('../markdown').render(markdown);
  })

  edge.global('includes', function(arr, item) {
    if(arr instanceof Array) {
      return arr.includes(item);
    } else {
      return false;
    }
  })

  require('../bns/edge.js')(edge);
}
