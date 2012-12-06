/*
 * BeautifulProperties.js - Extension of ECMAScript5 property.
 *
 * https://github.com/monjudoh/BeautifulProperties.js
 * version: 0.1.2
 *
 * Copyright (c) 2012 monjudoh
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Contributor(s):
 *  aodag (Atsushi Odagiri) aodagx@gmail.com https://github.com/aodag
 *    He named this library.
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
  var BeautifulProperties = {};
  var Array_from = (function () {
    return function(arrayLike) {
      var slice = Array.prototype.slice;
      return slice.call(arrayLike);
    };
  })();
  var toString = Object.prototype.toString;
  function isFunction(obj) {
    return toString.call(obj) == '[object Function]';
  }
  /**
   * @function
   * @param obj
   * @param key
   * @return {Boolean}
   */
  var hasOwn = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);
  var hasConsoleWarn = global.console && global.console.warn;
  var hasConsoleError = global.console && global.console.warn;

  Object.defineProperty(BeautifulProperties,'VERSION',{
    value : '0.1.2x',
    writable : false
  });

  Object.defineProperty(BeautifulProperties,'LazyInitializable',{
    value : Object.create(null),
    writable : false
  });
  (function (LazyInitializable) {
    var DescriptorKeys = 'configurable enumerable writable'.split(' ');
    var defaultDescriptor = (function () {
      var obj = Object.create(null);
      Object.defineProperty(obj,'key',{
        value : 1
      });
      return Object.getOwnPropertyDescriptor(obj,'key');
    })();
    /**
     *
     * @param object {Object}
     * @param key {String}
     * @param descriptor {Object}
     */
    LazyInitializable.define = function defineLazyInitializableProperty(object,key,descriptor) {
      var init = descriptor.init;
      var origDescriptor = descriptor;
      descriptor = Object.create(null);
      DescriptorKeys.forEach(function(key){
        var val = origDescriptor[key];
        if (val !== undefined) {
          descriptor[key] = val;
        } else {
          descriptor[key] = defaultDescriptor[key];
        }
      });
      Object.defineProperty(object,key,{
        get : function () {
          var self = this;
          var currentDescriptor = Object.getOwnPropertyDescriptor(self,key);
          // The getter is rarely called twice in Mobile Safari(iOS6.0).
          // Given init function is called twice when the getter is called twice.
          // If descriptor.writable or descriptor.configurable is false,
          // "Attempting to change value of a readonly property." error is thrown
          // when calling given init function for the second time.
          var isInitialized = !!currentDescriptor && hasOwn(currentDescriptor,'value');
          if (isInitialized) {
            return currentDescriptor.value;
          }
          var val = init.apply(self);
          descriptor.value = val;
          try {
            Object.defineProperty(self, key, descriptor);
          } catch (e) {
            if (hasConsoleError) {
              console.error(e);
              console.error(e.stack);
              console.error(self, key, descriptor, currentDescriptor);
            }
            throw e;
          }
          return val;
        },
        set : function (val) {
          var self = this;
          descriptor.value = val;
          Object.defineProperty(self,key,descriptor);
        },
        configurable : true
      });
    };
  })(BeautifulProperties.LazyInitializable);

  /**
   * @property {Boolean} isInited
   * @constructor
   */
  function Meta(){
    this.isInited = false;
  }

  BeautifulProperties.Internal = {};
  BeautifulProperties.Internal.Key = 'BeautifulProperties::internalObjectKey';
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
    Object.defineProperty(self,'meta',{
      value : (function(key){
        if (!this[key]) {
          this[key] = new Meta;
        }
        return this[key];
      }).bind(Object.create(null)),
      writable : false
    });
  }
  BeautifulProperties.Internal.retrieve = retrieveInternalObject;
  function retrieveInternalObject(key, create, object) {
    var internalObjectKey = BeautifulProperties.Internal.Key;
    var hasInternal = hasOwn(object,internalObjectKey);
    if (!create) {
      return (hasInternal ? object[internalObjectKey] : {})[key];
    }
    if (!hasInternal) {
      Object.defineProperty(object,internalObjectKey,{
        writable : true,
        configurable : true,
        enumerable : false,
        value : new InternalObject()
      });
    }
    return object[internalObjectKey][key];
  }

  var retrieveRaw = retrieveInternalObject.bind(null,'raw');
  /**
   *
   * @param {Object} object
   * @param {String} key
   * @return {*}
   */
  BeautifulProperties.getRaw = function getRaw(object,key) {
    return (retrieveRaw(false,object) || {})[key];
  };
  /**
   *
   * @param {Object} object
   * @param {String} key
   * @param {*} val
   */
  BeautifulProperties.setRaw = function setRaw(object,key,val) {
    var raw = retrieveRaw(true,object);
    raw[key] = val;
  };

  /**
   * @function
   * @returns {Meta}
   */
  var retrieveMeta = retrieveInternalObject.bind(null,'meta',true);

  BeautifulProperties.Hookable = Object.create(null);

  BeautifulProperties.Hookable.Undefined = Object.create(null);
  /**
   *
   * @param {Object} object
   * @param {string} key
   * @param {{beforeGet:?function,afterGet:?function,beforeSet:?function,afterSet:?function}} hooks
   * @param {?{value:?*,init:?function}} options
   */
  BeautifulProperties.Hookable.define = function defineHookableProperty(object,key,hooks,options) {
    var Undefined = BeautifulProperties.Hookable.Undefined;
    var beforeGet = hooks.beforeGet;
    var afterGet = hooks.afterGet;
    var beforeSet = hooks.beforeSet;
    var afterSet = hooks.afterSet;
    options = options || Object.create(null);

    var isValueExist = options.value !== undefined;
    Object.defineProperty(object,key,{
      get : function () {
        var self = this;
        var meta = retrieveMeta(self)(key);
        if (!meta.isInited && (options.init || isValueExist)) {
          meta.isInited = true;
          if (options.init) {
            self[key] = options.init.call(self);
          } else if (isValueExist) {
            self[key] = options.value;
          }
          return self[key];
        }
        if (beforeGet) {
          beforeGet.call(self);
        }
        var val = BeautifulProperties.getRaw(self,key);
        if (afterGet) {
          var replacedVal = afterGet.call(self,val);
          if (replacedVal === undefined && replacedVal !== Undefined) {
          } else if (replacedVal === Undefined) {
            val = undefined;
          } else {
            val = replacedVal;
          }
        }
        return val;
      },
      set : function (val) {
        var self = this;
        var meta = retrieveMeta(self)(key);
        if (!meta.isInited) {
          meta.isInited = true;
        }
        var previousVal = BeautifulProperties.getRaw(self,key);
        if (beforeSet) {
          var replacedVal = beforeSet.call(self,val,previousVal);
          if (replacedVal === undefined && replacedVal !== Undefined) {
          } else if (replacedVal === Undefined) {
            val = undefined;
          } else {
            val = replacedVal;
          }
        }
        BeautifulProperties.setRaw(self,key,val);
        if (afterSet) {
          afterSet.call(self,val,previousVal);
        }
      }
    });
  };

  // BeautifulProperties.Events 's implementation is cloned from backbone.js and modified.
  // https://github.com/documentcloud/backbone
  Object.defineProperty(BeautifulProperties,'Events',{
    value : Object.create(null),
    writable : false
  });
  (function (Events) {
    /**
     *
     * @property type {String}
     * @param type
     * @constructor
     */
    function Event(type) {
      Object.defineProperty(this,'type',{
        writable:false,
        value:type
      });
    }
    (function (proto) {
      Object.defineProperty(proto,'type',{
        writable:true,
        value:''
      });
      proto.stopPropagation = function stopPropagation () {
        // TODO implement
      };
    })(Event.prototype);
    Events.Event = Event;
  })(BeautifulProperties.Events);
  (function (Events,Event) {
    var retrieveCallbacks = retrieveInternalObject.bind(null,'callbacks',true);
    // Regular expression used to split event strings
    var eventSplitter = /\s+/;
    /**
     * Bind one or more space separated events, `events`, to a `callback`
     * @param object {Object}
     * @param events {String}
     * @param callback {Function}
     * @param options {Object} `context` is the ThisBinding of the callback execution context.
     */
    Events.on = function on(object, events, callback, options) {
      options = options || {};
//      var label = options.label || null;
      var context = options.context || null;
      var calls, event, list;
      if (!callback) {
        throw new Error('callback is necessary in BeautifulProperties.Events.on');
      }

      events = events.split(eventSplitter);
      calls = retrieveCallbacks(object);

      while (event = events.shift()) {
        list = calls[event] || (calls[event] = []);
        var boundCallback = context
          ? callback.bind(context)
          : function () {
            var self = this;
            callback.apply(self,Array_from(arguments));
          };
        boundCallback.originalCallback = callback;
        list.push(boundCallback);
      }
    };

    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `events` is null, removes all bound callbacks for all events.
    Events.off = function off(object, events, callback) {
      var event, calls, list, i;

      // No events, or removing *all* events.
      if (!(calls = retrieveCallbacks(object))){
        return;
      }
      if (!(events || callback)) {
        Object.keys(calls).forEach(function(event){
          delete calls[event];
        });
        return;
      }

      events = events ? events.split(eventSplitter) : Object.keys(calls);

      // Loop through the callback list, splicing where appropriate.
      while (event = events.shift()) {
        if (!(list = calls[event]) || !callback) {
          delete calls[event];
          continue;
        }

        for (i = list.length - 1; i >= 0; i--) {
          if (callback && list[i].originalCallback === callback) {
            list.splice(i, 1);
          }
        }
      }
    };
    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name.
    Events.trigger = function trigger(object, events) {
      var calls = retrieveCallbacks(object);
      // no callbacks
      if (!calls || Object.keys(calls).length == 0) {
        return;
      }
      triggerInternal(events, calls, object, Array_from(arguments).slice(2));
    };
    function triggerInternal(events, calls, object, rest) {
      events = events.split(eventSplitter);
      var event, list, i, length;
      // For each event, walk through the list of callbacks twice, first to
      // trigger the event, then to trigger any `"all"` callbacks.
      while (event = events.shift()) {
        // Copy callback lists to prevent modification.
        if (list = calls[event]) {
          list = list.slice()
        }

        // Execute event callbacks.
        if (list) {
          for (i = 0, length = list.length; i < length; i++) {
            list[i].apply(object, [new Event(event)].concat(rest));
          }
        }
      }
    }
    Events.triggerWithBubbling = function triggerWithBubbling(object, events) {
      var rest = Array_from(arguments).slice(2);
      var target = object;
      do {
        var calls = retrieveCallbacks(object);
        // no callbacks
        if (!calls || Object.keys(calls).length == 0) {
          continue;
        }
        triggerInternal(events, calls, target, rest);
      } while (object = Object.getPrototypeOf(object)) ;
    };
  })(BeautifulProperties.Events,BeautifulProperties.Events.Event);

  (function (Events) {
    /**
     *
     * @param object
     */
    Events.provideMethods = function provideMethods(object) {
      ['on','off','trigger','triggerWithBubbling'].forEach(function(methodName){
        // defined
        if (object[methodName]) {
          return;
        }
        var methodImpl = Events[methodName];
        object[methodName] = function () {
          var args = Array_from(arguments);
          args.unshift(this);
          methodImpl.apply(Events,args);
        };
      });
    };
  })(BeautifulProperties.Events);

  BeautifulProperties.Observable = Object.create(null);
  (function (Observable,Events) {
    /**
     *
     * @param {Object} object
     * @param {string} key
     * @param {{beforeGet:?function,afterGet:?function,beforeSet:?function,afterSet:?function}} hooks
     * @param {?{value:?*,init:?function,bubble:?boolean}} options
     */
    Observable.define = function defineObservableProperty(object,key,hooks,options) {
      var originalOptions = options;
      options = options || {};

      var wrappedHooks = {};
      hooks = hooks || Object.create(null);
      Object.keys(hooks).forEach(function(key){
        wrappedHooks[key] = hooks[key];
      });


      var trigger = options.bubble
        ? Events.triggerWithBubbling.bind(Events)
        : Events.trigger.bind(Events);
      var afterSet = hooks.afterSet;
      wrappedHooks.afterSet = function (val,previousVal) {
        var self = this;
        if (afterSet) {
          afterSet.call(self,val,previousVal);
        }
        if (previousVal != val) {
          trigger(self,('change:' + key),val,previousVal);
        }
      };
      BeautifulProperties.Hookable.define(object,key,wrappedHooks,originalOptions);
    };
  })(BeautifulProperties.Observable,BeautifulProperties.Events);

  return BeautifulProperties;
})(this),'BeautifulProperties',this);