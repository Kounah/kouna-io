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
}
