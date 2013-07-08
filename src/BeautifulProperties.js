/*
 * BeautifulProperties.js - Extension of ECMAScript5 property.
 *
 * https://github.com/monjudoh/BeautifulProperties.js
 * version: 0.1.6
 *
 * Copyright (c) 2012 monjudoh
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Contributor(s):
 *  aodag (Atsushi Odagiri) aodagx@gmail.com https://github.com/aodag
 *    He named this library.
 */
/**
 * @module BeautifulProperties
 * @version 0.1.6
 * @author monjudoh
 * @copyright (c) 2012 monjudoh<br/>
 * Dual licensed under the MIT (MIT-LICENSE.txt)<br/>
 * and GPL (GPL-LICENSE.txt) licenses.
 * @see https://github.com/monjudoh/BeautifulProperties.js
 * @see BeautifulProperties
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
})((function(global) {
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
    value : '0.1.6',
    writable : false
  });

  /**
   * The Namespace for internal functions.
   */
  var Internal = Object.create(null);

  /**
   * @name BeautifulProperties.GenericDescriptor
   * @typedef {{configurable:boolean=,enumerable:boolean=}}
   * @description GenericDescriptor<br>
   * http://www.ecma-international.org/ecma-262/5.1/#sec-8.10.3
   */
  /**
   * @name BeautifulProperties.DataDescriptor
   * @typedef {{configurable:boolean=,enumerable:boolean=,writable:boolean=,value:*=,init:function=}}
   * @description DataDescriptor<br>
   * http://www.ecma-international.org/ecma-262/5.1/#sec-8.10.2
   */
  /**
   * @name BeautifulProperties.AccessorDescriptor
   * @typedef {{configurable:boolean=,enumerable:boolean=,get:function=,set:function=}}
   * @description AccessorDescriptor.<br>
   * Either get or set is necessary.<br>
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
   *
   * @param {object} source
   * @returns {object}
   * @inner
   */
  function cloneDict(source){
    var target = Object.create(null);
    for (var key in source) {
      target[key] = source[key];
    }
    return target;
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
     * @name define
     * @memberOf BeautifulProperties.LazyInitializable
     * @function
     *
     * @param {object} object
     * @param {string} key
     * @param {BeautifulProperties.DataDescriptor} descriptor
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

  BeautifulProperties.Internal = Object.create(null);
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
  (function (InternalObject) {
    InternalObject.register = function register(object,namespace,value){
      var internalObjectKey = BeautifulProperties.Internal.Key;
      var hasInternal = hasOwn(object,internalObjectKey);
      if (!hasInternal) {
        Object.defineProperty(object,internalObjectKey,{
          writable : true,
          configurable : true,
          enumerable : false,
          value : new InternalObject()
        });
      }
      object[internalObjectKey][namespace] = value;
    };
  })(InternalObject);
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
   * @name getRaw
   * @memberOf BeautifulProperties
   * @function
   * @deprecated since version 0.1.6
   * @see BeautifulProperties.Hookable.getRaw
   *
   * @param {Object} object
   * @param {String} key
   * @return {*}
   */
  BeautifulProperties.getRaw = function getRaw(object,key) {
    return Internal.Hookable.getRaw(object,key);
  };
  /**
   * @name setRaw
   * @memberOf BeautifulProperties
   * @function
   * @deprecated since version 0.1.6
   * @see BeautifulProperties.Hookable.setRaw
   *
   * @param {Object} object
   * @param {String} key
   * @param {*} val
   */
  BeautifulProperties.setRaw = function setRaw(object,key,val) {
    Internal.Hookable.setRaw(object,key,val);
  };

  /**
   * @name Hookable
   * @namespace
   * @memberOf BeautifulProperties
   */
  BeautifulProperties.Hookable = Object.create(null);
  Internal.Hookable = Object.create(null);
  // Internal.Hookable
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
     * @function
     * @param {Array.<number>} array
     * @returns {number}
     * @private
     */
    function max(array) {
      return array.length === 1 ? array[0] : Math.max.apply(null,array);
    }
    /**
     * @function
     * @param {Array.<number>} array
     * @returns {number}
     * @private
     */
    function min(array) {
      return array.length === 1 ? array[0] : Math.min.apply(null,array);
    }

    var collectionProto = Object.create(null);
    /**
     * @name add
     * @memberOf HookCollection
     * @function
     * @param {function} hook
     * @param {number} priority 1..10000
     */
    collectionProto.add = function add(hook,priority) {
      // empty
      if (this.length === 0) {
        this.push(hook);
        this.priorities.push(priority);
        return;
      }
      // The given priority is highest.
      if (max(this.priorities) < priority) {
        this.unshift(hook);
        this.priorities.unshift(priority);
        return;
      }
      // The given priority is lowest.
      if (min(this.priorities) > priority) {
        this.push(hook);
        this.priorities.push(priority);
        return;
      }
      // The given hook is already exists.
      if (this.indexOf(hook) !== -1) {
        this.remove(hook);
      }
      // Insert the given hook and priority to the next index of the last priority
      // that greater equal than the given priority in the priorities.
      var threshold = min(this.priorities.filter(function (aPriority) {
        return aPriority >= priority;
      }));
      var index = this.priorities.lastIndexOf(threshold);
      this.priorities.splice(index + 1,0,priority);
      this.splice(index + 1,0,hook);
    };
    /**
     * @name remove
     * @memberOf HookCollection
     * @function
     * @param {function} hook
     */
    collectionProto.remove = function remove(hook) {
      var index = this.indexOf(hook);
      if (index === -1) {
        return;
      }
      this.splice(index,1);
      this.priorities.splice(index,1);
    };
    /**
     *
     * @name HookCollection
     * @constructor
     * @extends Array.<function>
     * @private
     */
    function HookCollection(){
      var collection = [];
      collection.priorities = [];
      Object.keys(collectionProto).forEach(function(key){
        collection[key] = collectionProto[key];
      });
      return collection;
    }
    /**
     * @name Hooks
     * @property {boolean} isDefined
     * @property {HookCollection} beforeGet
     * @property {HookCollection} afterGet
     * @property {HookCollection} beforeSet
     * @property {HookCollection} afterSet
     * @property {HookCollection} refresh
     * @constructor
     * @private
     */
    function Hooks(){}

    (function (proto) {
      proto.isDefined = false;
      'beforeGet afterGet beforeSet afterSet refresh'.split(' ').forEach(function(key){
        LazyInitializable.define(proto,key,{
          init:function(){
            return new HookCollection;
          }
        })
      });
    })(Hooks.prototype);
    PropertySpecific.mixinRetriever('Hookable::Meta',Meta);
    PropertySpecific.mixinRetriever('Hookable::Hooks',Hooks);
    PropertySpecific.mixinRetriever('Hookable::Descriptor');
    Internal.Hookable.retrieveMeta = PropertySpecific.retrieverFactory('Hookable::Meta',true);
    Internal.Hookable.retrieveHooks = PropertySpecific.retrieverFactory('Hookable::Hooks',true);
    Internal.Hookable.retrieveDescriptor = PropertySpecific.retrieverFactory('Hookable::Descriptor',false);
    Internal.Hookable.getRaw = (function () {
      var retrieveRaw = retrieveInternalObject.bind(null,'raw',false);
      var empty = Object.create(null);
      return function getRaw(object,key){
        return (retrieveRaw(object) || empty)[key];
      }
    })();
    Internal.Hookable.setRaw = (function () {
      var retrieveRaw = retrieveInternalObject.bind(null,'raw',true);
      return function setRaw(object,key,val) {
        var raw = retrieveRaw(object);
        raw[key] = val;
      }
    })();
  })(BeautifulProperties.LazyInitializable,InternalObject.PropertySpecific);
  /**
   * @name Get
   * @namespace
   * @memberOf BeautifulProperties.Hookable
   */
  BeautifulProperties.Hookable.Get = Object.create(null);
  (function (Get) {
    // internal functions
    var retrieveHooks = InternalObject.PrototypeWalker.retrieve.bind(null,'Hookable::Hooks');
    var retrieveDescriptor = InternalObject.PrototypeWalker.retrieve.bind(null,'Hookable::Descriptor');
    /**
     * @name refreshProperty
     * @memberOf BeautifulProperties.Hookable.Get
     * @function
     *
     * @param {object} object
     * @param {string} key
     *
     * @see BeautifulProperties.Hookable~refresh
     */
    Get.refreshProperty = function refreshProperty(object,key){
      var previousVal = Internal.Hookable.getRaw(object,key);
      var descriptor = retrieveDescriptor(object,key);
      var retriever = descriptor.get;
      var val = retriever.call(object);
      Internal.Hookable.setRaw(object,key,val);
      var storedHooks = retrieveHooks(object,key);
      storedHooks.refresh.forEach(function(refresh){
        refresh.call(object,val,previousVal);
      });
    };
    /**
     * @name getSilently
     * @memberOf BeautifulProperties.Hookable.Get
     * @function
     *
     * @param {object} object
     * @param {string} key
     * @return {*}
     */
    Get.getSilently = function getSilently(object,key){
      var descriptor = retrieveDescriptor(object,key);
      var retriever = descriptor.get;
      return retriever.call(object);
    };
    /**
     * @name provideMethods
     * @memberOf BeautifulProperties.Hookable.Get
     * @function
     * @description Provide refreshProperty method and getSilently method to object.
     *
     * @param {object} object
     */
    Get.provideMethods = provideMethodsFactory(Get,['refreshProperty','getSilently']);
  })(BeautifulProperties.Hookable.Get);
  (function (Hookable,Get,Descriptor,PropertySpecific) {
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
     * @name getRaw
     * @memberOf BeautifulProperties.Hookable
     * @function
     *
     * @param {Object} object
     * @param {String} key
     * @return {*}
     * @description Get the property value away from hook executing.
     */
    Hookable.getRaw = Internal.Hookable.getRaw;

    /**
     * @name setRaw
     * @memberOf BeautifulProperties.Hookable
     * @function
     *
     * @param {Object} object
     * @param {String} key
     * @param {*} val
     * @description Set the property value away from hook executing.
     */
    Hookable.setRaw = Internal.Hookable.setRaw;
    /**
     * @name hasHooks
     * @memberOf BeautifulProperties.Hookable
     * @function
     *
     * @param {object} object
     * @param {string} key
     * @return {boolean}
     * @description Return true if the property has hooks.
     */
    Hookable.hasHooks = (function (retrieve) {
      function hasHooks(object,key) {
        return !!retrieve(object,key);
      }
      return hasHooks;
    })(PropertySpecific.retrieverFactory('Hookable::Hooks',false));
    /**
     * @callback BeautifulProperties.Hookable~beforeGet
     */
    /**
     * @callback BeautifulProperties.Hookable~afterGet
     * @param {*} val
     * @param {*} previousVal
     * @return {*} replacedVal
     */
    /**
     * @callback BeautifulProperties.Hookable~beforeSet
     * @param {*} val
     * @param {*} previousVal
     * @return {*} replacedVal
     */
    /**
     * @callback BeautifulProperties.Hookable~afterSet
     * @param {*} val
     * @param {*} previousVal
     */
    /**
     * @callback BeautifulProperties.Hookable~refresh
     * @param {*} val
     * @param {*} previousVal
     */
    /**
     * @name addHook
     * @memberOf BeautifulProperties.Hookable
     * @function
     *
     * @param {object} object
     * @param {string} key
     * @param {string} hookType beforeGet afterGet beforeSet afterSet refresh
     * @param {BeautifulProperties.Hookable~beforeGet|BeautifulProperties.Hookable~afterGet|BeautifulProperties.Hookable~beforeSet|BeautifulProperties.Hookable~afterSet|BeautifulProperties.Hookable~refresh} hook
     * @param {number=} priority 1..10000.<br/>Default value is 100.
     * @description Add the given hook to the property.<br/>
     * The order of executing hooks:Higher priority -> Lower priprity,Added earlier -> Added later.<br/>
     * afterGet hook could replace get value.<br/>
     * beforeSet hook could replace set value.<br/>
     */
    Hookable.addHook = function addHook(object,key,hookType,hook,priority){
      if (!Hookable.hasHooks(object,key)) {
        throw new TypeError('The property (key:'+key+') is not a Hookable property. Hookable.addHook is the method for a Hookable property.');
      }
      var hooks = retrieveHooks(object,key);
      priority = priority || 100;
      hooks[hookType].add(hook,priority);
    };
    /**
     *
     * @function
     * @name addHooks
     * @memberOf BeautifulProperties.Hookable
     *
     * @param {object} object
     * @param {string} key
     * @param {{beforeGet:function=,afterGet:function=,beforeSet:function=,afterSet:function=,refresh:function=}} hooks
     * @see BeautifulProperties.Hookable.addHook
     */
    Hookable.addHooks = function addHooks(object,key,hooks) {
      if (!Hookable.hasHooks(object,key)) {
        throw new TypeError('The property (key:'+key+') is not a Hookable property. Hookable.addHooks is the method for a Hookable property.');
      }
      'beforeGet afterGet beforeSet afterSet refresh'.split(' ').forEach(function(hookType){
        if (hooks[hookType]) {
          Hookable.addHook(object,key,hookType,hooks[hookType]);
        }
      });
    };
    /**
     * @function
     * @name define
     * @memberOf BeautifulProperties.Hookable
     *
     * @param {object} object
     * @param {string} key
     * @param {{beforeGet:function=,afterGet:function=,beforeSet:function=,afterSet:function=,refresh:function=}=} hooks Deprecated.<br/>Reccomend to use Hookable.addHook or Hookable.addHooks method.
     * @param {(BeautifulProperties.DataDescriptor|BeautifulProperties.AccessorDescriptor|BeautifulProperties.GenericDescriptor)=} descriptor
     *  descriptor.writable's default value is false in ES5,but it's true in BeautifulProperties.Hookable.
     */
    Hookable.define = function defineHookableProperty(object,key,hooks,descriptor) {
      var Undefined = Hookable.Undefined;

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
      var storedHooks = retrieveHooks(object,key);
      if (hooks) {
        Hookable.addHooks(object,key,hooks);
      }
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
          Internal.Hookable.setRaw(this,key,initialValue);
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
                return get_afterGet.call(this,Internal.Hookable.getRaw(this,key));
              }
            case Descriptor.AccessorDescriptor:
              // write only
              if (!descriptor.get) {
                return undefined;
              }
              get_beforeGet.call(this);
              Get.refreshProperty(this,key);
              return get_afterGet.call(this,Internal.Hookable.getRaw(this,key));
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
              var previousVal = Internal.Hookable.getRaw(this,key);
              val = set_beforeSet.call(this,val,previousVal);
              Internal.Hookable.setRaw(this,key,val);
              set_afterSet.call(this,val,previousVal);
              break;
            case Descriptor.AccessorDescriptor:
              // read only
              if (!descriptor.set) {
                return;
              }
              var previousVal = Internal.Hookable.getRaw(this,key);
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
  })(BeautifulProperties.Hookable,BeautifulProperties.Hookable.Get,Internal.Descriptor,InternalObject.PropertySpecific);

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
     * @name BeautifulProperties.Events.Event.options
     * @typedef {{type:string,target:object,bubbles:boolean=}}
     * @description Options for BeautifulProperties.Events.Event constructor.
     */
    var readonlyKeys = 'type target'.split(' ');
    var necessaryKeys = 'type target'.split(' ');
    var optionalKeys = 'bubbles'.split(' ');
    /**
     *
     * @param {BeautifulProperties.Events.Event.options} options
     * @constructor
     * @name Event
     * @memberOf BeautifulProperties.Events
     */
    function Event(options) {
      var event = this;
      necessaryKeys.forEach(function(key){
        if (!(key in options)) {
          if (hasConsoleError) {
            console.error(key + " is necessary in Event's options.",options);
          }
          throw new Error(key + " is necessary in Event's options.");
        }
        event[key] = options[key];
      });
      optionalKeys.forEach(function(key){
        if (!(key in options)) {
          return;
        }
        event[key] = options[key];
      });
      readonlyKeys.forEach(function(key){
        Object.defineProperty(event,key,{
          writable:false
        });
      });

    }
    (function (proto) {
      /**
       * @type {boolean}
       * @name bubbles
       * @memberOf BeautifulProperties.Events.Event#
       * @description Default value is true.
       */
      proto.bubbles = true;
      /**
       * @type {boolean}
       * @name isPropagationStopped
       * @memberOf BeautifulProperties.Events.Event#
       * @description stop propagation flag
       */
      proto.isPropagationStopped = false;
      /**
       * @type {object}
       * @name currentTarget
       * @memberOf BeautifulProperties.Events.Event#
       */
      this.currentTarget = null;
      /**
       * @function
       * @name stopPropagation
       * @memberOf BeautifulProperties.Events.Event#
       */
      proto.stopPropagation = function stopPropagation () {
        this.isPropagationStopped = true;
      };
    })(Event.prototype);
    Events.Event = Event;
  })(BeautifulProperties.Events);

  (function (Events) {
    /**
     * @name BeautifulProperties.Events.Ancestor
     * @namespace
     */
    var Ancestor = Object.create(null);
    Events.Ancestor = Ancestor;
  })(BeautifulProperties.Events);
  (function (Ancestor,InternalObject) {
    var namespace = 'Events.Ancestor';
    /**
     * @callback BeautifulProperties.Events.Ancestor~ancestorRetriever
     * @param {object} object target object
     * @returns {object|null}
     * @description The function to retrieve the ancestor of given object.
     */
    /**
     *
     * @name setRetriever
     * @memberOf BeautifulProperties.Events.Ancestor
     * @param {object} object target object
     * @param {BeautifulProperties.Events.Ancestor~ancestorRetriever} ancestorRetriever
     * @function
     */
    Ancestor.setRetriever = function set(object,ancestorRetriever){
      InternalObject.register(object,namespace,ancestorRetriever);
    };
    /**
     *
     * @name retrieve
     * @memberOf BeautifulProperties.Events.Ancestor
     * @param {object} object target object
     * @returns {object|null} the ancestor of the target object
     * @function
     * @description Retrieve the ancestor of the target object by the ancestorRetriever that set on the target object.
     * If the target object don't have ancestorRetriever,the method returns the prototype of the target object.
     */
    Ancestor.retrieve = function retrieve(object) {
      var retriever = retrieveInternalObject(namespace,false,object);
      if (retriever) {
        return retriever(object);
      } else {
        return Object.getPrototypeOf(object);
      }
    };
  })(BeautifulProperties.Events.Ancestor,InternalObject);
  // event binding
  (function (Events) {
    var retrieveCallbacks = retrieveInternalObject.bind(null,'callbacks',true);
    /**
     * @name on
     * @memberOf BeautifulProperties.Events
     * @function
     *
     * @param {object} object
     * @param {string} event
     * @param {function} callback
     * @param {{context:*=}=} options `context` is the ThisBinding of the callback execution context.
     */
    Events.on = function on(object, event, callback, options) {
      options = options || Object.create(null);
      var context = options.context || null;
      if (!callback) {
        throw new Error('callback is necessary in BeautifulProperties.Events.on');
      }

      var calls = retrieveCallbacks(object);
      var list = calls[event] || (calls[event] = []);
      var boundCallback = context
        ? callback.bind(context)
        : function () {
          var self = this;
          callback.apply(self,Array_from(arguments));
      };
      boundCallback.originalCallback = callback;
      list.push(boundCallback);
    };

    /**
     * @name off
     * @memberOf BeautifulProperties.Events
     * @function
     *
     * @param {object} object
     * @param {string} event
     * @param {function} callback
     *
     * @description Remove callbacks.<br/>
     * If `callback` is null, removes all callbacks for the event.<br/>
     * If `event` is null, removes all bound callbacks for all events.
     */
    Events.off = function off(object, event, callback) {
      var events, calls, list, i;

      // No event, or removing *all* event.
      if (!(calls = retrieveCallbacks(object))){
        return;
      }
      if (!(event || callback)) {
        Object.keys(calls).forEach(function(event){
          delete calls[event];
        });
        return;
      }

      events = event ? [event] : Object.keys(calls);

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
  })(BeautifulProperties.Events);
  // event triggering
  (function (Events,Event,Ancestor) {
    var toString = Object.prototype.toString;
    var retrieveCallbacks = retrieveInternalObject.bind(null,'callbacks',false);
    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name.
    /**
     *
     * @name trigger
     * @memberOf BeautifulProperties.Events
     * @function
     *
     * @param {object} object
     * @param {string|BeautifulProperties.Events.Event.options} eventType
     */
    Events.trigger = function trigger(object, eventType) {
      var rest = Array_from(arguments).slice(2);
      var target = object;
      var currentTarget = object;
      var event;
      if (toString.call(eventType) == '[object String]') {
        event = new Event({type:eventType,target:target});
      } else {
        // eventType is a BeautifulProperties.Events.Event.options.
        event = new Event((function () {
          var options = cloneDict(eventType);
          options.target = target;
          return options;
        })());
      }

      do {
        if (target !== currentTarget && !event.bubbles) {
          // no bubbling
          break;
        }
        var callbackDict = retrieveCallbacks(currentTarget);
        // no callbacks
        if (!callbackDict || !callbackDict[event.type] || callbackDict[event.type].length === 0) {
          continue;
        }
        event.currentTarget = currentTarget;
        // Copy callback lists to prevent modification.
        callbackDict[event.type].slice().forEach(function(callback){
          callback.apply(target, [event].concat(rest));
        });
        if (!event.bubbles || event.isPropagationStopped) {
          break;
        }
      } while (currentTarget = Ancestor.retrieve(currentTarget)) ;
      event.currentTarget = null;
    };

    /**
     *
     * @name triggerWithBubbling
     * @memberOf BeautifulProperties.Events
     * @function
     *
     * @param {object} object
     * @param {string} eventType
     *
     * @deprecated since version 0.1.5
     */
    Events.triggerWithBubbling = function triggerWithBubbling(object, eventType) {
      var args = Array_from(arguments);
      // eventType argument
      args[1] = {type:eventType,bubbles:true};
      Events.trigger.apply(Events,args);
    };
  })(BeautifulProperties.Events,BeautifulProperties.Events.Event,BeautifulProperties.Events.Ancestor);

  (function (Events) {
    /**
     * @name provideMethods
     * @memberOf BeautifulProperties.Events
     * @function
     *
     * @param {object} object
     */
    Events.provideMethods = provideMethodsFactory(Events,['on','off','trigger','triggerWithBubbling']);
  })(BeautifulProperties.Events);

  /**
   * @name Equals
   * @namespace
   * @memberOf BeautifulProperties
   */
  BeautifulProperties.Equals = Object.create(null);
  /**
   * @name Functions
   * @namespace
   * @memberOf BeautifulProperties.Equals
   * @see BeautifulProperties.Equals.equals
   */
  BeautifulProperties.Equals.Functions = Object.create(null);
  (function (Functions) {
    /**
     * @name StrictEqual
     * @memberOf BeautifulProperties.Equals.Functions
     * @function
     *
     * @param {*} value
     * @param {*} otherValue
     * @returns {boolean}
     * @description ===
     */
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
     * @see BeautifulProperties.Equals.equals
     *
     * @param {object} object
     * @param {string} key
     * @param {function(*,*):boolean} equalsFn equals function for BeautifulProperties.Equals.equals.
     * @description It set the equals function on the property.
     */
    Equals.set = function set(object,key,equalsFn){
      equalsFn = equalsFn || Functions.StrictEqual;
      retrieve(object).store(key,equalsFn);
    };
    var walkAndRetrieve = InternalObject.PrototypeWalker.retrieve.bind(null,'Equals');
    /**
     * @name equals
     * @memberOf BeautifulProperties.Equals
     * @function
     *
     * @param {object} object
     * @param {string} key
     * @param {*} value
     * @param {*} otherValue
     * @returns {boolean}
     * @description If it returns true,value is equal to otherValue in the property.
     */
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
   * @name Observable
   * @namespace
   * @memberOf BeautifulProperties
   */
  BeautifulProperties.Observable = Object.create(null);
  (function (Observable,Events,Equals,Hookable) {
    // internal functions
    var retrieveDescriptor = Internal.Hookable.retrieveDescriptor;
    var trigger = Events.trigger.bind(Events);

    /**
     * @function
     * @name define
     * @memberOf BeautifulProperties.Observable
     * @see BeautifulProperties.Equals.equals
     * @see BeautifulProperties.Events.Event.options
     *
     * @param {object} object
     * @param {string} key
     * @param {{beforeGet:function=,afterGet:function=,beforeSet:function=,afterSet:function=,refresh:function=}=} hooks Deprecated.<br/>Reccomend to use Hookable.addHook or Hookable.addHooks method.
     * @param {(BeautifulProperties.DataDescriptor|BeautifulProperties.AccessorDescriptor|BeautifulProperties.GenericDescriptor)=} descriptor Deprecated.<br/>Reccomend to use Hookable.define method.
     *  descriptor.writable's default value is false in ES5,but it's true in BeautifulProperties.Hookable.
     * @param {{bubbles:boolean=}=} options part of BeautifulProperties.Events.Event.options.
     * @description This method can be use after Hookable.define.
     */
    Observable.define = function defineObservableProperty(object,key,hooks,descriptor,options) {
      options = options || Object.create(null);
      // Observable property depends on Hookable.
      if (!Hookable.hasHooks(object,key)) {
        Hookable.define(object,key,hooks,descriptor);
//        Hookable.define(object,key);
      }

      descriptor = retrieveDescriptor(object,key);
      function checkChangeAndTrigger(val,previousVal) {
        if (!Equals.equals(this,key,val,previousVal)){
          var eventOptions = cloneDict(options);
          eventOptions.type = 'change:' + key;
          trigger(this, eventOptions,val,previousVal);
        }
      }
      var hookType = descriptor.get ? 'refresh' : 'afterSet';
      Hookable.addHook(object,key,hookType,checkChangeAndTrigger,1);
    };
  })(BeautifulProperties.Observable,BeautifulProperties.Events,BeautifulProperties.Equals,BeautifulProperties.Hookable);

  /**
   * @name Versionizable
   * @namespace
   * @memberOf BeautifulProperties
   */
  BeautifulProperties.Versionizable = Object.create(null);
  (function (Versionizable) {
    /**
     * @constructor
     * @memberOf BeautifulProperties.Versionizable
     *
     * @property {boolean} isNull
     * @property {*} value
     * @property {number}　timestamp
     */
    function Version(){
    }
    Object.defineProperty(Version.prototype,'isNull',{
      value:false,
      writable:true
    });
    Versionizable.Version = Version;
  })(BeautifulProperties.Versionizable);
  (function (Versionizable,Hookable,Equals,PropertySpecific) {
    PropertySpecific.mixinRetriever('Versionizable::History',Array);
    /**
     * @function
     * @inner
     * @param {object} object
     * @returns {function(string):Array.<BeautifulProperties.Versionizable.Version>}
     */
    var retrieveHistory = retrieveInternalObject.bind(null,'Versionizable::History',true);
    // internal functions
    var retrieveDescriptor = Internal.Hookable.retrieveDescriptor;

    /**
     * @function
     * @name getHistoryLength
     * @memberOf BeautifulProperties.Versionizable
     *
     * @param {object} object
     * @param {string} key
     * @returns {number}
     */
    Versionizable.getHistoryLength = function getHistoryLength(object,key) {
      var history = retrieveHistory(object)(key);
      return history.length;
    };
    var aNullVersion = new (Versionizable.Version)();
    (function (version) {
      Object.defineProperty(version,'isNull',{
        value:true,
        writable:false
      });
      Object.defineProperty(version,'value',{
        value:undefined,
        writable:false
      });
    })(aNullVersion);
    /**
     * @function
     * @name getVersions
     * @memberOf BeautifulProperties.Versionizable
     *
     * @param {object} object
     * @param {string} key
     * @returns {Array.<BeautifulProperties.Versionizable.Version>}
     */
    Versionizable.getVersions = function getVersions(object,key) {
      var history = retrieveHistory(object)(key);
      return history.slice();
    };
    /**
     * @function
     * @name getVersion
     * @memberOf BeautifulProperties.Versionizable
     *
     * @param {object} object
     * @param {string} key
     * @param {number} index
     * @returns {BeautifulProperties.Versionizable.Version}
     */
    Versionizable.getVersion = function getVersion(object,key,index) {
      var history = retrieveHistory(object)(key);
      return history[index] || aNullVersion;
    };
    /**
     * @function
     * @name getPreviousValue
     * @memberOf BeautifulProperties.Versionizable
     *
     * @param {object} object
     * @param {string} key
     * @returns {*}
     */
    Versionizable.getPreviousValue = function getPreviousValue(object,key) {
      var history = retrieveHistory(object)(key);
      return (history[1] || aNullVersion).value;
    };
    /**
     * @function
     * @name define
     * @memberOf BeautifulProperties.Versionizable
     * @see BeautifulProperties.Equals.equals
     *
     * @param {object} object
     * @param {string} key
     * @param {{length:number=}=} options length's default value is 2.
     * @description This method can be use after Hookable.define.
     */
    Versionizable.define = function define(object,key,options) {
      options = options || Object.create(null);
      if (options.length === undefined) {
        options.length = 2;
      }
      // Versionizable property depends on Hookable.
      if (!Hookable.hasHooks(object,key)) {
        Hookable.define(object,key);
      }
      var descriptor = retrieveDescriptor(object,key);
      function checkChangeAndEnqueue(val,previousVal) {
        if (!Equals.equals(this,key,val,previousVal)) {
          var history = retrieveHistory(this)(key);
          var version = new (Versionizable.Version);
          version.value = val;
          version.timestamp = Date.now();
          history.unshift(version);
          // truncate
          if (history.length > options.length){
            history.length = options.length;
          }
        }
      }
      var hookType = descriptor.get ? 'refresh' : 'afterSet';
      Hookable.addHook(object,key,hookType,checkChangeAndEnqueue,10000);
    };
  })(BeautifulProperties.Versionizable,BeautifulProperties.Hookable,BeautifulProperties.Equals,InternalObject.PropertySpecific);

  return BeautifulProperties;
})(this),'BeautifulProperties',this);