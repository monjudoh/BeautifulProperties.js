(function(global) {
  function haveProperties(o) {
    if (o === undefined) {
      return false;
    }
    return Array.prototype.slice.call(arguments,1).every(function (name) {
      return name in o;
    });
  }

  function havePropertiesWithValues(o,expects) {
    return Object.getOwnPropertyNames(expects).every(function (name) {
      return o[name] === expects[name];
    });
  }

  function haveOwnPropertiesWithValues(o,expects) {
    if (o === undefined) {
      return false;
    }
    return Object.getOwnPropertyNames(expects).every(function (name) {
      return Object.prototype.hasOwnProperty.call(o, name) && o[name] === expects[name];
    });
  }

  global.haveProperties = haveProperties;
  global.havePropertiesWithValues = havePropertiesWithValues;
  global.haveOwnPropertiesWithValues = haveOwnPropertiesWithValues;
})(global||window);
