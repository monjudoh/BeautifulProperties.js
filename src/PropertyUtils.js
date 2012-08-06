/*
 * PropertyUtils.js - Extension of ECMAScript5 property.
 *
 * https://github.com/monjudoh/PropertyUtils.js
 * version: 0.1
 *
 * Copyright (c) 2012 monjudoh
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 */
;(function(module,moduleName,global){
  // in AMD
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    define(function() {
      return module;
    });
  } else {
    // in a browser or Rhino
    global[moduleName] = module;
  }
})((function(global, undefined) {
  var PropertyUtils = {};
  /**
   *
   * @param object {Object}
   * @param key {String}
   * @param defaultValueGenerator {Function}
   */
  PropertyUtils.defineDefaultValueProperty = function defineDefaultValueProperty(object,key,defaultValueGenerator) {
    Object.defineProperty(object,key,{
      get : function () {
        var self = this;
        var val = defaultValueGenerator.apply(self);
        Object.defineProperty(self,key,{
          value:val,
          writable:true
        });
        return val;
      },
      set : function (val) {
        var self = this;
        Object.defineProperty(self,key,{
          value:val,
          writable:true
        });
      },
      configurable : true
    });
  };
  return PropertyUtils;
})(this),'PropertyUtils',this);