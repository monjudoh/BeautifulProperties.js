/*
 * BeautifulProperties.js - Extension of ECMAScript5 property.
 *
 * https://github.com/monjudoh/BeautifulProperties.js
 * version: 0.1
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

  Object.defineProperty(BeautifulProperties,'VERSION',{
    value : '0.1.1x',
    writable : false
  });

  /**
   * @property {Boolean} isInited
   * @constructor
   */
  function Meta(){
    this.isInited = false;
  }

  /**
   * @type {Function}
   */
  var hasOwnProperty = Object.hasOwnProperty.call.bind(Object.hasOwnProperty);
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
    var hasInternal = hasOwnProperty(object,internalObjectKey);
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

  Object.defineProperty(BeautifulProperties,'LazyInitializable',{
    value : Object.create(null),
    writable : false
  });
  /**
   *
   * @param object {Object}
   * @param key {String}
   * @param init {Function}
   */
  BeautifulProperties.LazyInitializable.define = function defineDefaultValueProperty(object,key,init) {
    Object.defineProperty(object,key,{
      get : function () {
        var self = this;
        var val = init.apply(self);
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
   * @param {String} key
   * @param {Object} hooks
   * @param {Object} options
   */
  BeautifulProperties.Hookable.define = function defineHookableProperty(object,key,hooks,options) {
    var Undefined = BeautifulProperties.Hookable.Undefined;
    /**
     *
     * @function
     */
    var beforeGet = hooks.beforeGet;
    /**
     *
     * @function
     */
    var afterGet = hooks.afterGet;
    /**
     *
     * @function
     */
    var beforeSet = hooks.beforeSet;
    /**
     *
     * @function
     */
    var afterSet = hooks.afterSet;
    options = options || Object.create(null);

    var value = options.value;

    // TODO remove start
    if ((options.defaultVal || options.defaultValGenerator) && (global.console && global.console.warn)) {
      if (options.defaultVal) {
        console.warn('options.defaultVal is deprecated.You shoud use options.value.',object,key);
      }
      if (options.defaultValGenerator) {
        console.warn('options.defaultValGenerator is deprecated.You shoud use options.init.',object,key);
      }
    }
    value = value || options.defaultVal;
    function retrieveDefaultVal(){
      var self = this;
      var defaultVal = options.defaultVal;
      var defaultValGenerator = options.defaultValGenerator;
      if (defaultVal) {
        return defaultVal;
      }
      if (defaultValGenerator) {
        return defaultValGenerator.apply(self);
      }
    }
    if (options.defaultVal || options.defaultValGenerator) {
    } else {
      retrieveDefaultVal = null;
    }
    // TODO remove end
    Object.defineProperty(object,key,{
      get : function () {
        var self = this;
        var meta = retrieveMeta(self)(key);
        if (!meta.isInited && (options.init || value)) {
          meta.isInited = true;
          if (options.init) {
            self[key] = options.init.call(self);
          } else if (value) {
            self[key] = value;
          }
          return self[key];
        }
        if (beforeGet) {
          beforeGet.call(self);
        }
        var val = BeautifulProperties.getRaw(self,key);
        // TODO remove start
        if (retrieveDefaultVal && val === undefined) {
          val = retrieveDefaultVal.apply(self);
        }
        // TODO remove end
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
        var previousVal = BeautifulProperties.getRaw(self,key);
        // TODO remove start
        if (retrieveDefaultVal && previousVal === undefined) {
          previousVal = retrieveDefaultVal.apply(self);
        }
        // TODO remove end
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
     * @param {String} key
     * @param {Object} hooks
     * @param {Object} options
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
          trigger(self,('change:' + key),val,previousVal);
        }
      };
      BeautifulProperties.Hookable.define(object,key,wrappedHooks,originalOptions);
    };
  })(BeautifulProperties.Observable,BeautifulProperties.Events);

  return BeautifulProperties;
})(this),'BeautifulProperties',this);