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
  function InternalObject() {
    var self = this;
    Object.defineProperty(self,'raw',{
      value : {},
      writable : false
    });
    Object.defineProperty(self,'callbacks',{
      value : {},
      writable : false
    });
  }

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
      object[internalObjectKey] = new InternalObject();
    }
    var raw = object[internalObjectKey].raw;
    return raw[key];
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
      object[internalObjectKey] = new InternalObject();
    }
    var raw = object[internalObjectKey].raw;
    raw[key] = val;
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
        var previousVal = self[key];
        if (beforeSet) {
          val = beforeSet.call(self,val,previousVal);
        }
        PropertyUtils.setRaw(self,key,val);
        if (afterSet) {
          afterSet.call(self,val,previousVal);
        }
      }
    });
  };

  // PropertyUtils.Events 's implementation is cloned from backbone.js and modified.
  // https://github.com/documentcloud/backbone
  PropertyUtils.Events = {};
  (function (Events) {
    function getCallbacks(object) {
      var internalObjectKey = PropertyUtils.internalObjectKey;
      if (!object[internalObjectKey]) {
        object[internalObjectKey] = new InternalObject();
      }
      return object[internalObjectKey].callbacks;
    }
    // Regular expression used to split event strings
    var eventSplitter = /\s+/;
    // Bind one or more space separated events, `events`, to a `callback`
    Events.on = function on(object, events, callback, context) {
      var calls, event, list;
      if (!callback) {
        throw new Error('callback is necessary in PropertyUtils.Events.on');
      }

      events = events.split(eventSplitter);
      calls = getCallbacks(object);

      while (event = events.shift()) {
        list = calls[event] || (calls[event] = []);
        list.push(callback.bind(context || object));
      }
    };
    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name.
    Events.trigger = function trigger(object, events) {
      var event, calls, list, i, length, args, all, rest;
      calls = getCallbacks(object);
      // no callbacks
      if (Object.keys(calls).length == 0) {
        return;
      }

      events = events.split(eventSplitter);

      rest = [];
      // Fill up `rest` with the callback arguments. Since we're only copying
      // the tail of `arguments`, a loop is much faster than Array#slice.
      for (i = 2, length = arguments.length; i < length; i++) {
        rest[i - 2] = arguments[i];
      }

      // For each event, walk through the list of callbacks twice, first to
      // trigger the event, then to trigger any `"all"` callbacks.
      while (event = events.shift()) {
        // Copy callback lists to prevent modification.
        if (list = calls[event]){
          list = list.slice()
        }

        // Execute event callbacks.
        if (list) {
          for (i = 0, length = list.length; i < length; i++) {
            list[i].apply(null, rest);
          }
        }
      }
    };
  })(PropertyUtils.Events);
  /**
   *
   * @param {Object} object
   * @param {String} key
   * @param {Object} hooks
   */
  PropertyUtils.defineObservableProperty = function defineObservableProperty(object,key,hooks) {
    var wrappedHooks = {};
    Object.keys(hooks).forEach(function(key){
      wrappedHooks[key] = hooks[key];
    });
    /**
     *
     * @type {Function}
     */
    var afterSet = hooks.afterSet;
    wrappedHooks.afterSet = function (val,previousVal) {
      var self = this;
      if (afterSet) {
        afterSet.call(self,val,previousVal);
      }
      if (previousVal != val) {
        PropertyUtils.Events.trigger(self,('change:' + key),val,previousVal);
      }
    };
    PropertyUtils.defineHookableProperty(object,key,wrappedHooks);
  };
  return PropertyUtils;
})(this),'PropertyUtils',this);