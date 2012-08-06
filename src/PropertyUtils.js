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
  PropertyUtils.internalObjectKey = 'PropertyUtils::internalObjectKey';
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
  /**
   *
   * @param {Object} object
   * @param {String} key
   * @return {*}
   */
  PropertyUtils.getRaw = function getRaw(object,key) {
    var internalObjectKey = PropertyUtils.internalObjectKey;
    if (!object[internalObjectKey]) {
      object[internalObjectKey] = {};
    }
    var internalObject = object[internalObjectKey];
    return internalObject[key];
  };
  /**
   *
   * @param {Object} object
   * @param {String} key
   * @param {*} val
   */
  PropertyUtils.setRaw = function setRaw(object,key,val) {
    var internalObjectKey = PropertyUtils.internalObjectKey;
    if (!object[internalObjectKey]) {
      object[internalObjectKey] = {};
    }
    var internalObject = object[internalObjectKey];
    internalObject[key] = val;
  };
  /**
   *
   * @param {Object} object
   * @param {String} key
   * @param {Object} hooks
   */
  PropertyUtils.defineHookableProperty = function defineHookableProperty(object,key,hooks) {
    /**
     *
     * @type {Function}
     */
    var beforeGet = hooks.beforeGet;
    /**
     *
     * @type {Function}
     */
    var afterGet = hooks.afterGet;
    /**
     *
     * @type {Function}
     */
    var beforeSet = hooks.beforeSet;
    /**
     *
     * @type {Function}
     */
    var afterSet = hooks.afterSet;
    Object.defineProperty(object,key,{
      get : function () {
        var self = this;
        if (beforeGet) {
          beforeGet.call(self);
        }
        var val = PropertyUtils.getRaw(self,key);
        if (afterGet) {
          val = afterGet.call(self,val);
        }
        return val;
      },
      set : function (val) {
        var self = this;
        if (beforeSet) {
          val = beforeSet.call(self,val);
        }
        PropertyUtils.setRaw(self,key,val);
        if (afterSet) {
          afterSet.call(self,val);
        }
      }
    });
  };
  return PropertyUtils;
})(this),'PropertyUtils',this);