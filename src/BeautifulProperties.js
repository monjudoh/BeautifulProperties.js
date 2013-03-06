/*
 * BeautifulProperties.js - Extension of ECMAScript5 property.
 *
 * https://github.com/monjudoh/BeautifulProperties.js
 * version: 0.1.3
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
  /**
   * @name BeautifulProperties
   * @namespace
   */
  var BeautifulProperties = Object.create(null);
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

  /**
   * @constant
   * @name VERSION
   * @memberOf BeautifulProperties
   */
  Object.defineProperty(BeautifulProperties,'VERSION',{
    value : '0.1.3x',
    writable : false
  });

  /**
   * The Namespace for internal functions.
   */
  var Internal = Object.create(null);

  /**
   * @name BeautifulProperties.GenericDescriptor
   * @typedef {{configurable:?boolean,enumerable:?boolean}}
   * @description GenericDescriptor
   * http://www.ecma-international.org/ecma-262/5.1/#sec-8.10.3
   */
  /**
   * @name BeautifulProperties.DataDescriptor
   * @typedef {{configurable:?boolean,enumerable:?boolean,writable:?boolean,value:?*,init:?function}}
   * @description DataDescriptor.
   * http://www.ecma-international.org/ecma-262/5.1/#sec-8.10.2
   */
  /**
   * @name BeautifulProperties.AccessorDescriptor
   * @typedef {{configurable:?boolean,enumerable:?boolean,get:?function,set:?function}}
   * @description AccessorDescriptor.Either get or set is necessary.
   * http://www.ecma-international.org/ecma-262/5.1/#sec-8.10.1
   */

  Internal.Descriptor = Object.create(null);
  (function (Descriptor) {
    Descriptor.GenericDescriptor = Object.create(null);
    Descriptor.DataDescriptor = Object.create(null);
    Descriptor.AccessorDescriptor = Object.create(null);
    Descriptor.InvalidDescriptor = Object.create(null);
    Descriptor.getTypeOf = function getTypeOf(descriptor){
      if (descriptor === undefined) {
        return Descriptor.InvalidDescriptor;
      }
      var isDataDescriptor = descriptor.writable !== undefined || descriptor.value !== undefined || descriptor.init!== undefined;
      var isAccessorDescriptor = descriptor.get !== undefined || descriptor.set !== undefined;
      if (!isDataDescriptor && !isAccessorDescriptor) {
        return Descriptor.GenericDescriptor;
      }
      if (isDataDescriptor && isAccessorDescriptor) {
        return Descriptor.InvalidDescriptor;
      }
      if (isDataDescriptor) {
        return Descriptor.DataDescriptor;
      }
      if (isAccessorDescriptor) {
        return Descriptor.AccessorDescriptor;
      }
    };
    Descriptor.createTypeError = function createTypeError(invalidDescriptor){
      try{
        Object.defineProperty(Object.create(null),'prop', invalidDescriptor);
      }catch(e){
        return new TypeError(e.message);
      }
    };
  })(Internal.Descriptor);

  /**
   * @function
   * @param {{configurable:?boolean,enumerable:?boolean,writable:?boolean}} descriptor
   * @param {{configurable:?boolean,enumerable:?boolean,writable:?boolean}} defaultDescriptor
   * @return {{configurable:?boolean,enumerable:?boolean,writable:?boolean}} descriptor
   */
  var applyDefaultDescriptor = (function () {
    var obj = Object.create(null);
    Object.defineProperty(obj,'key',{});
    var globalDefaultDescriptor = Object.getOwnPropertyDescriptor(obj,'key');
    var DescriptorKeys = 'configurable enumerable writable value init'.split(' ');
    function applyDefaultDescriptor(descriptor,defaultDescriptor){
      var origDescriptor = descriptor || Object.create(null);
      descriptor = Object.create(null);
      var i,key;
      for (i = 0; i < DescriptorKeys.length; i++) {
        key = DescriptorKeys[i];
        descriptor[key] = origDescriptor[key];
      }
      for (i = 0; i < DescriptorKeys.length; i++) {
        key = DescriptorKeys[i];
        if (descriptor[key] !== undefined) {
          continue;
        }
        if (defaultDescriptor && defaultDescriptor[key] !== undefined) {
          descriptor[key] = defaultDescriptor[key];
          continue;
        }
        descriptor[key] = globalDefaultDescriptor[key];
      }
      return descriptor;
    }
    return applyDefaultDescriptor;
  })();

  /**
   * @function
   * @param namespaceObject {object}
   * @param keys {Array.<string>}
   * @return {function}
   * @private
   */
  function provideMethodsFactory(namespaceObject,keys) {
    function provideMethods(object) {
      keys.forEach(function(methodName){
        // defined
        if (object[methodName]) {
          return;
        }
        var methodImpl = namespaceObject[methodName];
        object[methodName] = function () {
          var args = Array_from(arguments);
          args.unshift(this);
          return methodImpl.apply(namespaceObject,args);
        };
      });
    }
    return provideMethods;
  }

  /**
   * @name LazyInitializable
   * @namespace
   * @memberOf BeautifulProperties
   */
  Object.defineProperty(BeautifulProperties,'LazyInitializable',{
    value : Object.create(null),
    writable : false
  });
  (function (LazyInitializable) {
    /**
     *
     * @param {object} object
     * @param {string} key
     * @param {BeautifulProperties.DataDescriptor} descriptor
     * @name define
     * @memberOf BeautifulProperties.LazyInitializable
     * @function
     */
    LazyInitializable.define = function defineLazyInitializableProperty(object,key,descriptor) {
      var init = descriptor.init;
      descriptor = applyDefaultDescriptor(descriptor);
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
  }
  InternalObject.PropertySpecific = Object.create(null);
  (function (PropertySpecific,LazyInitializable) {
    /**
     *
     * @param key
     * @param constructor
     * @private
     */
    PropertySpecific.mixinRetriever = function mixinRetriever(key,constructor) {
      LazyInitializable.define(InternalObject.prototype,key,{
        init: function() {
          var object = Object.create(null);
          var canCreate = typeof constructor === 'function';
          var boundRetrieve = (function retrieve(key,create){
            if (create === undefined) {
              create = true;
            }
            if (canCreate && create && !this[key]) {
              this[key] = new constructor;
            }
            return this[key];
          }).bind(object);
          boundRetrieve.store = (function store(key,value) {
            this[key] = value;
          }).bind(object);
          return boundRetrieve;
        },writable:false
      });
    };
    /**
     *
     * @param key
     * @param create
     * @return {function}
     * @private
     */
    PropertySpecific.retrieverFactory = function retrieverFactory(key,create) {
      var getRetrieverFromObject = retrieveInternalObject.bind(null,key,create);
      return function (object,key) {
        var retrieve = getRetrieverFromObject(object);
        return retrieve !== undefined
          ? retrieve(key,create)
          : undefined;
      }
    };
  })(InternalObject.PropertySpecific,BeautifulProperties.LazyInitializable);
  InternalObject.PrototypeWalker = Object.create(null);
  (function (PrototypeWalker,PropertySpecific) {

    PropertySpecific.mixinRetriever('PrototypeWalker::Cache',function() {
      return Object.create(null);
    });
    var retrieveCache = PropertySpecific.retrieverFactory('PrototypeWalker::Cache',true);
    PrototypeWalker.retrieve = function retrieve(internalObjectKey,object,key){
      var prototypeCache = retrieveCache(object,key);
      var retrieveValue = PropertySpecific.retrieverFactory(internalObjectKey,false);
      if (prototypeCache[internalObjectKey]) {
        return retrieveValue(prototypeCache[internalObjectKey],key);
      }
      // Walk the prototype chain until it found internal object.
      var proto = object;
      var value;
      while (!value && proto) {
        value = retrieveValue(proto,key);
        if (value) {
          prototypeCache[internalObjectKey] = proto;
          return value;
        }
        proto = Object.getPrototypeOf(proto);
      }
    };
  })(InternalObject.PrototypeWalker,InternalObject.PropertySpecific);
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
   *
   * @namespace
   */
  BeautifulProperties.Hookable = Object.create(null);
  Internal.Hookable = Object.create(null);
  (function (LazyInitializable,PropertySpecific) {
    /**
     * @property {boolean} isInited
     * @constructor
     * @private
     */
    function Meta(){
      this.isInited = false;
    }
    /**
     * @property {boolean} isDefined
     * @property {Array.<function>} beforeGet
     * @property {Array.<function>} afterGet
     * @property {Array.<function>} beforeSet
     * @property {Array.<function>} afterSet
     * @property {Array.<function>} refresh
     * @constructor
     * @private
     */
    function Hooks(){
      this.isDefined = false;
      this.beforeGet = [];
      this.afterGet = [];
      this.beforeSet = [];
      this.afterSet = [];
      this.refresh = [];
    }
    PropertySpecific.mixinRetriever('Hookable::Meta',Meta);
    PropertySpecific.mixinRetriever('Hookable::Hooks',Hooks);
    PropertySpecific.mixinRetriever('Hookable::Descriptor');
    Internal.Hookable.retrieveMeta = PropertySpecific.retrieverFactory('Hookable::Meta',true);
    Internal.Hookable.retrieveHooks = PropertySpecific.retrieverFactory('Hookable::Hooks',true);
    Internal.Hookable.retrieveDescriptor = PropertySpecific.retrieverFactory('Hookable::Descriptor',false);
  })(BeautifulProperties.LazyInitializable,InternalObject.PropertySpecific);
  /**
   * @namespace
   */
  BeautifulProperties.Hookable.Get = Object.create(null);
  (function (Get) {
    // internal functions
    var retrieveHooks = InternalObject.PrototypeWalker.retrieve.bind(null,'Hookable::Hooks');
    var retrieveDescriptor = InternalObject.PrototypeWalker.retrieve.bind(null,'Hookable::Descriptor');
    /**
     *
     * @param object
     * @param key
     * @name refreshProperty
     * @memberOf BeautifulProperties.Hookable.Get
     * @function
     */
    Get.refreshProperty = function refreshProperty(object,key){
      var previousVal = BeautifulProperties.getRaw(object,key);
      var descriptor = retrieveDescriptor(object,key);
      var retriever = descriptor.get;
      var val = retriever.call(object);
      BeautifulProperties.setRaw(object,key,val);
      var storedHooks = retrieveHooks(object,key);
      storedHooks.refresh.forEach(function(refresh){
        refresh.call(object,val,previousVal);
      });
    };
    /**
     *
     * @param object
     * @param key
     * @return {*}
     * @name getSilently
     * @memberOf BeautifulProperties.Hookable.Get
     * @function
     */
    Get.getSilently = function getSilently(object,key){
      var descriptor = retrieveDescriptor(object,key);
      var retriever = descriptor.get;
      return retriever.call(object);
    };
    /**
     *
     * @param object
     * @name provideMethods
     * @memberOf BeautifulProperties.Hookable.Get
     * @function
     */
    Get.provideMethods = provideMethodsFactory(Get,['refreshProperty','getSilently']);
  })(BeautifulProperties.Hookable.Get);
  (function (Hookable,Get,Descriptor) {
    // internal functions
    var retrieveMeta = Internal.Hookable.retrieveMeta;
    var retrieveHooks = Internal.Hookable.retrieveHooks;
    var retrieveDescriptor = Internal.Hookable.retrieveDescriptor;

    /**
     * @name Undefined
     * @memberOf BeautifulProperties.Hookable
     */
    Hookable.Undefined = Object.create(null);
    /**
     * @function
     * @name define
     * @memberOf BeautifulProperties.Hookable
     *
     * @param {object} object
     * @param {string} key
     * @param {?{beforeGet:?function,afterGet:?function,beforeSet:?function,afterSet:?function,refresh:?function}} hooks
     * @param {BeautifulProperties.DataDescriptor|BeautifulProperties.AccessorDescriptor|BeautifulProperties.GenericDescriptor} descriptor
     *  descriptor.writable's default value is false in ES5,but it's true in BeautifulProperties.Hookable.
     */
    Hookable.define = function defineHookableProperty(object,key,hooks,descriptor) {
      var Undefined = Hookable.Undefined;
      var storedHooks = retrieveHooks(object,key);
      hooks = hooks || Object.create(null);
      'beforeGet afterGet beforeSet afterSet refresh'.split(' ').forEach(function(key){
        if (hooks[key]) {
          storedHooks[key].push(hooks[key]);
        }
      });
      descriptor = descriptor || Object.create(null);
      // TODO store
      var type = Descriptor.getTypeOf(descriptor);
      if (type === Descriptor.InvalidDescriptor) {
        throw Descriptor.createTypeError(descriptor);
      }
      if (type !== Descriptor.AccessorDescriptor) {
        descriptor = applyDefaultDescriptor(descriptor,{writable:true});
        type = Descriptor.DataDescriptor;
      } else {
        // TODO clone
      }
      // The hookable property is already defined.
      // TODO modify descriptor
      if (storedHooks.isDefined) {
        return;
      }
      storedHooks.isDefined = true;
      retrieveInternalObject.bind(null,'Hookable::Descriptor',true)(object).store(key,descriptor);

      // internal functions
      function init_DataDescriptor(){
        var descriptor = retrieveDescriptor(object,key);
        var meta = retrieveMeta(this,key);
        var isValueExist = descriptor.value !== undefined;
        meta.isInited = true;
        var initialValue;
        if (descriptor.init) {
          initialValue = descriptor.init.call(this);
        } else if (isValueExist) {
          initialValue = descriptor.value;
        }
        if (descriptor.writable) {
          this[key] = initialValue;
        } else {
          BeautifulProperties.setRaw(this,key,initialValue);
        }
      }
      function get_beforeGet(){
        var self = this;
        var storedHooks = retrieveHooks(object,key);
        storedHooks.beforeGet.forEach(function(beforeGet){
          beforeGet.call(self);
        });
      }

      function get_afterGet(val){
        var self = this;
        var storedHooks = retrieveHooks(object,key);
        storedHooks.afterGet.forEach(function(afterGet){
          var replacedVal = afterGet.call(self,val);
          if (replacedVal === undefined && replacedVal !== Undefined) {
          } else if (replacedVal === Undefined) {
            val = undefined;
          } else {
            val = replacedVal;
          }
        });
        return val;
      }
      function set_beforeSet(val,previousVal){
        var self = this;
        var storedHooks = retrieveHooks(object,key);
        storedHooks.beforeSet.forEach(function(beforeSet){
          var replacedVal = beforeSet.call(self,val,previousVal);
          if (replacedVal === undefined && replacedVal !== Undefined) {
          } else if (replacedVal === Undefined) {
            val = undefined;
          } else {
            val = replacedVal;
          }
        });
        return val;
      }
      function set_afterSet(val,previousVal){
        var self = this;
        var storedHooks = retrieveHooks(object,key);
        storedHooks.afterSet.forEach(function(afterSet){
          afterSet.call(self,val,previousVal);
        });
      }
      Object.defineProperty(object,key,{
        get : function __BeautifulProperties_Hookable_get() {
          var descriptor = retrieveDescriptor(object,key);
          var meta = retrieveMeta(this,key);
          switch (type) {
            case Descriptor.DataDescriptor:
              var isValueExist = descriptor.value !== undefined;
              if (!meta.isInited && (descriptor.init || isValueExist)) {
                init_DataDescriptor.call(this);
                return this[key];
              } else {
                get_beforeGet.call(this);
                return get_afterGet.call(this,BeautifulProperties.getRaw(this,key));
              }
            case Descriptor.AccessorDescriptor:
              // write only
              if (!descriptor.get) {
                return undefined;
              }
              get_beforeGet.call(this);
              Get.refreshProperty(this,key);
              return get_afterGet.call(this,BeautifulProperties.getRaw(this,key));
            default :
              throw new Error('InvalidState');
          }
        },
        set : function __BeautifulProperties_Hookable_set(val) {
          var descriptor = retrieveDescriptor(object,key);
          switch (type) {
            case Descriptor.DataDescriptor:
              // read only
              if (!descriptor.writable) {
                return;
              }
              var meta = retrieveMeta(this,key);
              if (!meta.isInited) {
                meta.isInited = true;
              }
              var previousVal = BeautifulProperties.getRaw(this,key);
              val = set_beforeSet.call(this,val,previousVal);
              BeautifulProperties.setRaw(this,key,val);
              set_afterSet.call(this,val,previousVal);
              break;
            case Descriptor.AccessorDescriptor:
              // read only
              if (!descriptor.set) {
                return;
              }
              var previousVal = BeautifulProperties.getRaw(this,key);
              val = set_beforeSet.call(this,val,previousVal);
              descriptor.set.call(this,val);
              if (descriptor.get) {
                Get.refreshProperty(this,key);
              }
              set_afterSet.call(this,val,previousVal);
              break;
            default :
              throw new Error('InvalidState');
          }
        }
      });
    };
  })(BeautifulProperties.Hookable,BeautifulProperties.Hookable.Get,Internal.Descriptor);

  // BeautifulProperties.Events 's implementation is cloned from backbone.js and modified.
  // https://github.com/documentcloud/backbone
  /**
   * @name BeautifulProperties.Events
   * @namespace
   */
  Object.defineProperty(BeautifulProperties,'Events',{
    value : Object.create(null),
    writable : false
  });
  (function (Events) {
    /**
     *
     * @param type
     * @constructor
     * @memberOf BeautifulProperties.Events
     */
    function Event(type) {
      Object.defineProperty(this,'type',{
        writable:false,
        value:type
      });
    }
    (function (proto) {
      /**
       * @type {string}
       * @name type
       * @memberOf BeautifulProperties.Events.Event
       */
      Object.defineProperty(proto,'type',{
        writable:true,
        value:''
      });
      /**
       * @function
       * @name stopPropagation
       * @memberOf BeautifulProperties.Events.Event
       */
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
     * @name on
     * @memberOf BeautifulProperties.Events
     * @function
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
    /**
     *
     * @param object
     * @param events
     * @param callback
     * @name off
     * @memberOf BeautifulProperties.Events
     * @function
     */
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
    /**
     *
     * @param object
     * @param events
     * @name trigger
     * @memberOf BeautifulProperties.Events
     * @function
     */
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

    /**
     *
     * @param object
     * @param events
     * @name triggerWithBubbling
     * @memberOf BeautifulProperties.Events
     * @function
     */
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
     * @name provideMethods
     * @memberOf BeautifulProperties.Events
     * @function
     */
    Events.provideMethods = provideMethodsFactory(Events,['on','off','trigger','triggerWithBubbling']);
  })(BeautifulProperties.Events);

  /**
   *
   * @namespace
   */
  BeautifulProperties.Equals = Object.create(null);
  /**
   *
   * @namespace
   */
  BeautifulProperties.Equals.Functions = Object.create(null);
  (function (Functions) {
    Functions.StrictEqual = function StrictEqual(value,otherValue){
      return value === otherValue;
    };
  })(BeautifulProperties.Equals.Functions);
  (function (Equals,Functions,PropertySpecific) {
    PropertySpecific.mixinRetriever('Equals');
    var retrieve = retrieveInternalObject.bind(null,'Equals',true);
    /**
     * @name set
     * @memberOf BeautifulProperties.Equals
     * @function
     *
     * @param {object} object
     * @param {string} key
     * @param {function} equalsFn
     */
    Equals.set = function set(object,key,equalsFn){
      equalsFn = equalsFn || Functions.StrictEqual;
      retrieve(object).store(key,equalsFn);
    };
    var walkAndRetrieve = InternalObject.PrototypeWalker.retrieve.bind(null,'Equals');
    Equals.equals = function equals(object,key,value,otherValue){
      var equalsFn = walkAndRetrieve(object,key);
      if (!equalsFn) {
        return value === otherValue;
      }
      if (equalsFn === Functions.StrictEqual){
        return value === otherValue;
      }
      return equalsFn.call(object,value,otherValue);
    };
  })(BeautifulProperties.Equals,BeautifulProperties.Equals.Functions,InternalObject.PropertySpecific);


  /**
   *
   * @namespace
   */
  BeautifulProperties.Observable = Object.create(null);
  (function (Observable,Events,Equals) {
    // internal functions
    var retrieveHooks = Internal.Hookable.retrieveHooks;
    var retrieveDescriptor = Internal.Hookable.retrieveDescriptor;

    /**
     * @function
     * @name define
     * @memberOf BeautifulProperties.Observable
     *
     * @param {object} object
     * @param {string} key
     * @param {{beforeGet:?function,afterGet:?function,beforeSet:?function,afterSet:?function}} hooks
     * @param {BeautifulProperties.DataDescriptor|BeautifulProperties.AccessorDescriptor|BeautifulProperties.GenericDescriptor} descriptor
     *  descriptor.writable's default value is false in ES5,but it's true in BeautifulProperties.Hookable.
     */
    Observable.define = function defineObservableProperty(object,key,hooks,descriptor) {
      var options = descriptor || Object.create(null);
      BeautifulProperties.Hookable.define(object,key,hooks,descriptor);

      descriptor = retrieveDescriptor(object,key);
      Equals.set(object,key,options.equals);
      var trigger = options.bubble
      ? Events.triggerWithBubbling.bind(Events)
      : Events.trigger.bind(Events);
      var hooks = retrieveHooks(object,key);
      function checkChangeAndTrigger(val,previousVal) {
        if (!Equals.equals(this,key,val,previousVal)){
          trigger(this,('change:' + key),val,previousVal);
        }
      }
      if (descriptor.get) {
        hooks.refresh.push(checkChangeAndTrigger);
      } else {
        hooks.afterSet.push(checkChangeAndTrigger);
      }
    };
  })(BeautifulProperties.Observable,BeautifulProperties.Events,BeautifulProperties.Equals);

  return BeautifulProperties;
})(this),'BeautifulProperties',this);