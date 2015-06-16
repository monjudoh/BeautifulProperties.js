var BeautifulProperties = function () {
  var namespace, internal_Descriptor, utils_hasOwn, utils_hasConsoleError, utils_createChildNamespace, LazyInitializable, Hookable_namespace, InternalObject_constructor, InternalObject, InternalObject_NamespacedKVS, Hookable_Raw, InternalObject_PrototypeWalker, Hookable_HookCollection, Hookable_Hooks, Hookable_Descriptor, utils_Array_from, utils_provideMethodsFactory, Hookable_Get, Hookable_Status, Hookable_alias, Hookable_impl, Hookable, Events_namespace, Events_Event, Events_Ancestor, Events_HandlerCollection, Events_bindImpl, utils_cloneDict, Events_triggerImpl, Events_impl, Events, Equals_namespace, Equals_Functions, Equals_impl, Equals, Observable_namespace, Observable_impl, Observable, Versionizable_namespace, Versionizable_Version, Versionizable_History, Versionizable_Transaction, Versionizable_impl, Versionizable, deprecated_Internal, deprecated_since019, deprecated, BeautifulProperties;
  namespace = function () {
    /**
     * @name BeautifulProperties
     * @namespace
     * @version 0.1.11
     * @author monjudoh
     * @copyright <pre>(c) 2012 monjudoh
     * Dual licensed under the MIT (MIT-LICENSE.txt)
     * and GPL (GPL-LICENSE.txt) licenses.</pre>
     * @see https://github.com/monjudoh/BeautifulProperties.js
     * @description <pre>BeautifulProperties.js - Extension of ECMAScript5 property.</pre>
     */
    var BeautifulProperties = Object.create(null);
    return BeautifulProperties;
  }();
  internal_Descriptor = function () {
    /**
     * @name BeautifulProperties~GenericDescriptor
     * @typedef
     * @property {boolean=} configurable
     * @property {boolean=} enumerable
     * @description <pre>GenericDescriptor
     * http://www.ecma-international.org/ecma-262/5.1/#sec-8.10.3</pre>
     */
    /**
     * @name BeautifulProperties~DataDescriptor
     * @typedef
     * @property {boolean=} configurable
     * @property {boolean=} enumerable
     * @property {boolean=} writable
     * @property {*=} value
     * @property {function=} init custom extension
     * @description <pre>DataDescriptor
     * http://www.ecma-international.org/ecma-262/5.1/#sec-8.10.2</pre>
     */
    /**
     * @name BeautifulProperties~AccessorDescriptor
     * @typedef
     * @property {boolean=} configurable
     * @property {boolean=} enumerable
     * @property {function=} get Either get or set is necessary.
     * @property {function=} set Either get or set is necessary.
     * @description <pre>AccessorDescriptor.
     * http://www.ecma-international.org/ecma-262/5.1/#sec-8.10.1</pre>
     */
    /**
     * @namespace BeautifulProperties~Descriptor
     * @private
     */
    var Descriptor = Object.create(null);
    /**
     * @typedef Type
     * @memberOf BeautifulProperties~Descriptor
     * @description marker object
     */
    /**
     * @memberOf BeautifulProperties~Descriptor
     * @enum {BeautifulProperties~Descriptor.Type}
     */
    var Types = {
      /**
       * http://www.ecma-international.org/ecma-262/5.1/#sec-8.10.3
       */
      GenericDescriptor: Object.create(null),
      /**
       * http://www.ecma-international.org/ecma-262/5.1/#sec-8.10.2
       */
      DataDescriptor: Object.create(null),
      /**
       * http://www.ecma-international.org/ecma-262/5.1/#sec-8.10.1
       */
      AccessorDescriptor: Object.create(null),
      /**
       * invalid
       */
      InvalidDescriptor: Object.create(null)
    };
    Descriptor.Types = Types;
    var AllDescriptorKeys = 'configurable enumerable writable value init get set'.split(' ');
    /**
     * @function equals
     * @memberOf BeautifulProperties~Descriptor
     *
     * @param {object} descriptor
     * @param {object} otherDescriptor
     * @returns boolean
     */
    Descriptor.equals = function equals(descriptor, otherDescriptor) {
      var length = AllDescriptorKeys.length;
      for (var i = 0; i < length; i++) {
        var key = AllDescriptorKeys[i];
        if (descriptor[key] !== otherDescriptor[key]) {
          return false;
        }
      }
      return true;
    };
    /**
     * @function getTypeOf
     * @memberOf BeautifulProperties~Descriptor
     *
     * @param {object} descriptor
     * @returns {BeautifulProperties~Descriptor.Type}
     */
    Descriptor.getTypeOf = function getTypeOf(descriptor) {
      if (descriptor === undefined) {
        return Types.InvalidDescriptor;
      }
      var isDataDescriptor = descriptor.writable !== undefined || descriptor.value !== undefined || descriptor.init !== undefined;
      var isAccessorDescriptor = descriptor.get !== undefined || descriptor.set !== undefined;
      if (!isDataDescriptor && !isAccessorDescriptor) {
        return Types.GenericDescriptor;
      }
      if (isDataDescriptor && isAccessorDescriptor) {
        return Types.InvalidDescriptor;
      }
      if (isDataDescriptor) {
        return Types.DataDescriptor;
      }
      if (isAccessorDescriptor) {
        return Types.AccessorDescriptor;
      }
    };
    /**
     * @function createTypeError
     * @memberOf BeautifulProperties~Descriptor
     *
     * @param {object} invalidDescriptor
     * @returns {TypeError}
     */
    Descriptor.createTypeError = function createTypeError(invalidDescriptor) {
      try {
        Object.defineProperty(Object.create(null), 'prop', invalidDescriptor);
      } catch (e) {
        return new TypeError(e.message);
      }
    };
    var globalDefaultDataDescriptor = function () {
      var obj = Object.create(null);
      Object.defineProperty(obj, 'key', {});
      return Object.getOwnPropertyDescriptor(obj, 'key');
    }();
    var DataDescriptorKeys = 'configurable enumerable writable value init'.split(' ');
    var globalDefaultAccessorDescriptor = function () {
      var obj = Object.create(null);
      Object.defineProperty(obj, 'key', {
        get: function () {
        }
      });
      var descriptor = Object.getOwnPropertyDescriptor(obj, 'key');
      delete descriptor.get;
      return descriptor;
    }();
    var AccessorDescriptorKeys = 'configurable enumerable get set'.split(' ');
    /**
     * @function applyDefault
     * @memberOf BeautifulProperties~Descriptor
     *
     * @param {BeautifulProperties~Descriptor.Type} type
     * @param {object} descriptor
     * @param {BeautifulProperties~GenericDescriptor=|BeautifulProperties~DataDescriptor=|BeautifulProperties~AccessorDescriptor=} defaultDescriptor
     * @returns {BeautifulProperties~DataDescriptor}
     */
    Descriptor.applyDefault = function applyDefault(type, descriptor, defaultDescriptor) {
      var DescriptorKeys;
      var globalDefaultDescriptor;
      switch (type) {
      case Types.DataDescriptor:
        DescriptorKeys = DataDescriptorKeys;
        globalDefaultDescriptor = globalDefaultDataDescriptor;
        break;
      case Types.AccessorDescriptor:
        DescriptorKeys = AccessorDescriptorKeys;
        globalDefaultDescriptor = globalDefaultAccessorDescriptor;
        break;
      default:
        throw new Error('The type argument is invalid in Internal.Descriptor.applyDefault.');
      }
      var origDescriptor = descriptor || Object.create(null);
      descriptor = Object.create(null);
      var i, key;
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
    };
    return Descriptor;
  }();
  utils_hasOwn = function () {
    /**
     * @function
     * @param obj
     * @param key
     * @return {Boolean}
     */
    var hasOwn = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);
    return hasOwn;
  }();
  utils_hasConsoleError = typeof console !== 'undefined' && !!console.error;
  utils_createChildNamespace = function () {
    function createChildNamespace(parent, name) {
      var namespace = Object.create(null);
      Object.defineProperty(parent, name, {
        value: namespace,
        writable: false,
        configurable: false
      });
      return namespace;
    }
    return createChildNamespace;
  }();
  LazyInitializable = function (BeautifulProperties, Descriptor, hasOwn, hasConsoleError, createChildNamespace) {
    /**
     * @namespace LazyInitializable
     * @memberOf BeautifulProperties
     */
    var LazyInitializable = createChildNamespace(BeautifulProperties, 'LazyInitializable');
    /**
     * @function define
     * @memberOf BeautifulProperties.LazyInitializable
     *
     * @param {object} object
     * @param {string} key
     * @param {BeautifulProperties~DataDescriptor} descriptor
     */
    LazyInitializable.define = function defineLazyInitializableProperty(object, key, descriptor) {
      var init = descriptor.init;
      descriptor = Descriptor.applyDefault(Descriptor.Types.DataDescriptor, descriptor);
      Object.defineProperty(object, key, {
        get: function () {
          var self = this;
          var currentDescriptor = Object.getOwnPropertyDescriptor(self, key);
          // The getter is rarely called twice in Mobile Safari(iOS6.0).
          // Given init function is called twice when the getter is called twice.
          // If descriptor.writable or descriptor.configurable is false,
          // "Attempting to change value of a readonly property." error is thrown
          // when calling given init function for the second time.
          var isInitialized = !!currentDescriptor && hasOwn(currentDescriptor, 'value');
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
        set: function (val) {
          var self = this;
          descriptor.value = val;
          Object.defineProperty(self, key, descriptor);
        },
        configurable: true
      });
    };
    return LazyInitializable;
  }(namespace, internal_Descriptor, utils_hasOwn, utils_hasConsoleError, utils_createChildNamespace);
  Hookable_namespace = function (BeautifulProperties, createChildNamespace) {
    /**
     * @namespace Hookable
     * @memberOf BeautifulProperties
     */
    return createChildNamespace(BeautifulProperties, 'Hookable');
  }(namespace, utils_createChildNamespace);
  InternalObject_constructor = function (hasOwn) {
    /**
     * @constructor BeautifulProperties~InternalObject
     * @private
     */
    function InternalObject() {
    }
    InternalObject.Key = 'BeautifulProperties::InternalObject::Key';
    var Key = InternalObject.Key;
    InternalObject.register = function register(object, namespace, value) {
      var hasInternal = hasOwn(object, Key);
      if (!hasInternal) {
        Object.defineProperty(object, Key, {
          writable: true,
          configurable: true,
          enumerable: false,
          value: new InternalObject()
        });
      }
      object[Key][namespace] = value;
    };
    InternalObject.retrieve = function retrieve(namespace, create, object) {
      var hasInternal = hasOwn(object, Key);
      if (!create) {
        return (hasInternal ? object[Key] : {})[namespace];
      }
      if (!hasInternal) {
        Object.defineProperty(object, Key, {
          writable: true,
          configurable: true,
          enumerable: false,
          value: new InternalObject()
        });
      }
      return object[Key][namespace];
    };
    return InternalObject;
  }(utils_hasOwn);
  InternalObject = function (InternalObject) {
    return InternalObject;
  }(InternalObject_constructor);
  InternalObject_NamespacedKVS = function (InternalObject, LazyInitializable) {
    /**
     * @namespace BeautifulProperties~InternalObject/NamespacedKVS
     * @private
     */
    var NamespacedKVS = Object.create(null);
    NamespacedKVS.mixinNamespace = function mixinNamespace(namespase, constructor) {
      LazyInitializable.define(InternalObject.prototype, namespase, {
        init: function () {
          var container = Object.create(null);
          container.dict = Object.create(null);
          container._constructor = constructor;
          container.canCreate = typeof constructor === 'function';
          return container;
        },
        writable: false
      });
    };
    /**
     * @callback BeautifulProperties~InternalObject/NamespacedKVS~retrieveFn
     * @param {object} object
     * @param {string} key
     * @returns {*} value
     */
    /**
     * @function retrieveFnFactory
     * @memberOf BeautifulProperties~InternalObject/NamespacedKVS
     * @param {string} namespase
     * @param {boolean} create
     * @returns {BeautifulProperties~InternalObject/NamespacedKVS~retrieveFn}
     */
    NamespacedKVS.retrieveFnFactory = function retrieveFnFactory(namespase, create) {
      if (create === undefined) {
        create = true;
      }
      return function retrieve(object, key) {
        var container = InternalObject.retrieve(namespase, create, object);
        if (container === undefined) {
          return undefined;
        }
        if (container.canCreate && create && !container.dict[key]) {
          container.dict[key] = new container._constructor();
        }
        return container.dict[key];
      };
    };
    /**
     * @callback BeautifulProperties~InternalObject/NamespacedKVS~storeFn
     * @param {object} object
     * @param {string} key
     * @param {*} value
     */
    /**
     * @function storeFnFactory
     * @memberOf BeautifulProperties~InternalObject/NamespacedKVS
     * @param {string} namespase
     * @returns {BeautifulProperties~InternalObject/NamespacedKVS~storeFn}
     */
    NamespacedKVS.storeFnFactory = function storeFnFactory(namespase) {
      return function store(object, key, value) {
        var container = InternalObject.retrieve(namespase, true, object);
        container.dict[key] = value;
      };
    };
    /**
     * @callback BeautifulProperties~InternalObject/NamespacedKVS~removeFn
     * @param {object} object
     * @param {string} key
     */
    /**
     * @function removeFnFactory
     * @memberOf BeautifulProperties~InternalObject/NamespacedKVS
     * @param {string} namespase
     * @returns {BeautifulProperties~InternalObject/NamespacedKVS~removeFn}
     */
    NamespacedKVS.removeFnFactory = function removeFnFactory(namespase) {
      return function remove(object, key) {
        var container = InternalObject.retrieve(namespase, false, object);
        if (container) {
          delete container.dict[key];
        }
      };
    };
    /**
     * @callback BeautifulProperties~InternalObject/NamespacedKVS~keysFn
     * @param {object} object
     * @param {Array.<string>} keys
     */
    /**
     * @function keysFnFactory
     * @memberOf BeautifulProperties~InternalObject/NamespacedKVS
     * @param {string} namespase
     * @returns {BeautifulProperties~InternalObject/NamespacedKVS~keysFn}
     */
    NamespacedKVS.keysFnFactory = function keysFnFactory(namespase) {
      return function keys(object) {
        var container = InternalObject.retrieve(namespase, false, object);
        if (container) {
          return Object.keys(container.dict);
        } else {
          return [];
        }
      };
    };
    return NamespacedKVS;
  }(InternalObject, LazyInitializable);
  Hookable_Raw = function (NamespacedKVS) {
    NamespacedKVS.mixinNamespace('Hookable::Raw');
    /**
     * @namespace BeautifulProperties.Hookable~Raw
     * @private
     */
    var Raw = Object.create(null);
    /**
     * @function retrieve
     * @memberOf BeautifulProperties.Hookable~Raw
     * @param {object} object
     * @param {string} key
     * @returns {*}
     */
    Raw.retrieve = NamespacedKVS.retrieveFnFactory('Hookable::Raw', false);
    /**
     * @function store
     * @memberOf BeautifulProperties.Hookable~Raw
     * @param {object} object
     * @param {string} key
     * @param {*}
     */
    Raw.store = NamespacedKVS.storeFnFactory('Hookable::Raw');
    return Raw;
  }(InternalObject_NamespacedKVS);
  InternalObject_PrototypeWalker = function (NamespacedKVS) {
    var PrototypeWalker = Object.create(null);
    NamespacedKVS.mixinNamespace('PrototypeWalker::Cache', function () {
      return Object.create(null);
    });
    var retrieveCache = NamespacedKVS.retrieveFnFactory('PrototypeWalker::Cache', true);
    PrototypeWalker.retrieve = function retrieve(namespace, object, key) {
      var prototypeCache = retrieveCache(object, key);
      var retrieveValue = NamespacedKVS.retrieveFnFactory(namespace, false);
      if (prototypeCache[namespace]) {
        return retrieveValue(prototypeCache[namespace], key);
      }
      // Walk the prototype chain until it found internal object.
      var proto = object;
      var value;
      while (!value && proto) {
        value = retrieveValue(proto, key);
        if (value) {
          prototypeCache[namespace] = proto;
          return value;
        }
        proto = Object.getPrototypeOf(proto);
      }
    };
    return PrototypeWalker;
  }(InternalObject_NamespacedKVS);
  Hookable_HookCollection = function () {
    /**
     * @function BeautifulProperties.Hookable~HookCollection~max
     * @param {Array.<number>} array
     * @returns {number}
     * @private
     */
    function max(array) {
      return array.length === 1 ? array[0] : Math.max.apply(null, array);
    }
    /**
     * @function BeautifulProperties.Hookable~HookCollection~min
     * @param {Array.<number>} array
     * @returns {number}
     * @private
     */
    function min(array) {
      return array.length === 1 ? array[0] : Math.min.apply(null, array);
    }
    var proto = Object.create(null);
    /**
     * @function add
     * @memberOf BeautifulProperties.Hookable~HookCollection#
     * @param {function} hook
     * @param {number} priority 1..10000
     */
    proto.add = function add(hook, priority) {
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
      this.priorities.splice(index + 1, 0, priority);
      this.splice(index + 1, 0, hook);
    };
    /**
     * @function remove
     * @memberOf BeautifulProperties.Hookable~HookCollection#
     * @param {function} hook
     */
    proto.remove = function remove(hook) {
      var index = this.indexOf(hook);
      if (index === -1) {
        return;
      }
      this.splice(index, 1);
      this.priorities.splice(index, 1);
    };
    /**
     *
     * @constructor BeautifulProperties.Hookable~HookCollection
     * @extends Array.<function>
     * @private
     */
    function HookCollection() {
      var collection = [];
      collection.priorities = [];
      Object.keys(proto).forEach(function (key) {
        collection[key] = proto[key];
      });
      return collection;
    }
    return HookCollection;
  }();
  Hookable_Hooks = function (LazyInitializable, NamespacedKVS, PrototypeWalker, HookCollection) {
    /**
     * @constructor BeautifulProperties.Hookable~Hooks
     * @property {BeautifulProperties.Hookable~HookCollection} beforeGet
     * @property {BeautifulProperties.Hookable~HookCollection} afterGet
     * @property {BeautifulProperties.Hookable~HookCollection} beforeSet
     * @property {BeautifulProperties.Hookable~HookCollection} afterSet
     * @property {BeautifulProperties.Hookable~HookCollection} refresh
     * @private
     */
    function Hooks() {
    }
    var proto = Hooks.prototype;
    'beforeGet afterGet beforeSet afterSet refresh'.split(' ').forEach(function (key) {
      LazyInitializable.define(proto, key, {
        init: function () {
          return new HookCollection();
        }
      });
    });
    NamespacedKVS.mixinNamespace('Hookable::Hooks', Hooks);
    /**
     * @function retrieve
     * @memberOf BeautifulProperties.Hookable~Hooks
     * @param {object} object
     * @param {string} key
     * @returns BeautifulProperties.Hookable~Hooks
     */
    Hooks.retrieve = NamespacedKVS.retrieveFnFactory('Hookable::Hooks', true);
    /**
     * @function walkAndRetrieve
     * @memberOf BeautifulProperties.Hookable~Hooks
     * @param {object} object
     * @param {string} key
     * @returns BeautifulProperties.Hookable~Hooks
     */
    Hooks.walkAndRetrieve = PrototypeWalker.retrieve.bind(null, 'Hookable::Hooks');
    /**
     * @function has
     * @memberOf BeautifulProperties.Hookable~Hooks
     * @param {object} object
     * @param {string} key
     * @returns boolean
     */
    Hooks.has = function (retrieve) {
      function hasHooks(object, key) {
        return !!retrieve(object, key);
      }
      return hasHooks;
    }(NamespacedKVS.retrieveFnFactory('Hookable::Hooks', false));
    return Hooks;
  }(LazyInitializable, InternalObject_NamespacedKVS, InternalObject_PrototypeWalker, Hookable_HookCollection);
  Hookable_Descriptor = function (base, NamespacedKVS, PrototypeWalker) {
    /**
     * @namespace BeautifulProperties.Hookable~Descriptor
     * @extends BeautifulProperties~Descriptor
     * @private
     */
    var Descriptor = Object.create(base);
    NamespacedKVS.mixinNamespace('Hookable::Descriptor');
    /**
     * @function retrieve
     * @memberOf BeautifulProperties.Hookable~Descriptor
     * @param {object} object
     * @param {string} key
     * @returns {(BeautifulProperties~DataDescriptor|BeautifulProperties~AccessorDescriptor|BeautifulProperties~GenericDescriptor)=}
     */
    Descriptor.retrieve = NamespacedKVS.retrieveFnFactory('Hookable::Descriptor', false);
    /**
     * @function walkAndRetrieve
     * @memberOf BeautifulProperties.Hookable~Descriptor
     * @param {object} object
     * @param {string} key
     * @returns {(BeautifulProperties~DataDescriptor|BeautifulProperties~AccessorDescriptor|BeautifulProperties~GenericDescriptor)=}
     */
    Descriptor.walkAndRetrieve = PrototypeWalker.retrieve.bind(null, 'Hookable::Descriptor');
    /**
     * @function store
     * @memberOf BeautifulProperties.Hookable~Descriptor
     * @param {object} object
     * @param {string} key
     * @param {(BeautifulProperties~DataDescriptor|BeautifulProperties~AccessorDescriptor|BeautifulProperties~GenericDescriptor)}
     */
    Descriptor.store = NamespacedKVS.storeFnFactory('Hookable::Descriptor');
    return Descriptor;
  }(internal_Descriptor, InternalObject_NamespacedKVS, InternalObject_PrototypeWalker);
  utils_Array_from = function () {
    var slice = Array.prototype.slice;
    return function Array_from(arrayLike) {
      return slice.call(arrayLike);
    };
    return Array_from;
  }();
  utils_provideMethodsFactory = function (Array_from) {
    /**
     * @function
     * @param namespaceObject {object}
     * @param keys {Array.<string>}
     * @return {function}
     * @private
     */
    function provideMethodsFactory(namespaceObject, keys) {
      function provideMethods(object) {
        keys.forEach(function (methodName) {
          // defined
          if (object[methodName]) {
            return;
          }
          var methodImpl = namespaceObject[methodName];
          Object.defineProperty(object, methodName, {
            value: function () {
              var args = Array_from(arguments);
              args.unshift(this);
              return methodImpl.apply(namespaceObject, args);
            },
            enumerable: false,
            configurable: true
          });
        });
      }
      return provideMethods;
    }
    return provideMethodsFactory;
  }(utils_Array_from);
  Hookable_Get = function (Hookable, Raw, Hooks, Descriptor, provideMethodsFactory, createChildNamespace) {
    /**
     * @namespace Get
     * @memberOf BeautifulProperties.Hookable
     */
    var Get = createChildNamespace(Hookable, 'Get');
    /**
     * @function refreshProperty
     * @memberOf BeautifulProperties.Hookable.Get
     *
     * @param {object} object
     * @param {string} key
     *
     * @see BeautifulProperties.Hookable~refresh
     */
    Get.refreshProperty = function refreshProperty(object, key) {
      var previousVal = Raw.retrieve(object, key);
      var descriptor = Descriptor.walkAndRetrieve(object, key);
      var retriever = descriptor.get;
      var val = retriever.call(object);
      Raw.store(object, key, val);
      var storedHooks = Hooks.walkAndRetrieve(object, key);
      storedHooks.refresh.forEach(function (refresh) {
        refresh.call(object, val, previousVal);
      });
    };
    /**
     * @function getSilently
     * @memberOf BeautifulProperties.Hookable.Get
     *
     * @param {object} object
     * @param {string} key
     * @return {*}
     */
    Get.getSilently = function getSilently(object, key) {
      var descriptor = Descriptor.walkAndRetrieve(object, key);
      var retriever = descriptor.get;
      return retriever.call(object);
    };
    /**
     * @function provideMethods
     * @memberOf BeautifulProperties.Hookable.Get
     * @description Provide refreshProperty method and getSilently method to object.
     *
     * @param {object} object
     * @see BeautifulProperties.Hookable.Get.refreshProperty
     * @see BeautifulProperties.Hookable.Get.getSilently
     */
    Get.provideMethods = provideMethodsFactory(Get, [
      'refreshProperty',
      'getSilently'
    ]);
    return Get;
  }(Hookable_namespace, Hookable_Raw, Hookable_Hooks, Hookable_Descriptor, utils_provideMethodsFactory, utils_createChildNamespace);
  Hookable_Status = function (NamespacedKVS) {
    /**
     * @constructor BeautifulProperties.Hookable~Status
     * @property {boolean} isInitialized
     * @private
     */
    function Status() {
      this.isInitialized = false;
    }
    NamespacedKVS.mixinNamespace('Hookable::Status', Status);
    /**
     * @function retrieve
     * @memberOf BeautifulProperties.Hookable~Status
     * @param {object} object
     * @param {string} key
     * @returns BeautifulProperties.Hookable~Status
     */
    Status.retrieve = NamespacedKVS.retrieveFnFactory('Hookable::Status', true);
    return Status;
  }(InternalObject_NamespacedKVS);
  Hookable_alias = function (Hookable, Raw, Hooks) {
    /**
     * @function getRaw
     * @memberOf BeautifulProperties.Hookable
     *
     * @param {object} object
     * @param {string} key
     * @returns {*}
     * @description Get the property value away from hook executing.
     * @see BeautifulProperties.Hookable~Raw.retrieve
     */
    Hookable.getRaw = Raw.retrieve;
    /**
     * @function setRaw
     * @memberOf BeautifulProperties.Hookable
     *
     * @param {object} object
     * @param {string} key
     * @param {*} val
     * @description Set the property value away from hook executing.
     * @see BeautifulProperties.Hookable~Raw.store
     */
    Hookable.setRaw = Raw.store;
    /**
     * @function hasHooks
     * @memberOf BeautifulProperties.Hookable
     *
     * @param {object} object
     * @param {string} key
     * @returns {boolean}
     * @description Return true if the property has hooks.
     * @see BeautifulProperties.Hookable~Hooks.has
     */
    Hookable.hasHooks = Hooks.has;
  }(Hookable_namespace, Hookable_Raw, Hookable_Hooks);
  Hookable_impl = function (Hookable, Get, Raw, Status, Hooks, Descriptor) {
    /**
     * @name Undefined
     * @memberOf BeautifulProperties.Hookable
     */
    Hookable.Undefined = Object.create(null);
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
     * @function addHook
     * @memberOf BeautifulProperties.Hookable
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
    Hookable.addHook = function addHook(object, key, hookType, hook, priority) {
      if (!Hooks.has(object, key)) {
        throw new TypeError('The property (key:' + key + ') is not a Hookable property. Hookable.addHook is the method for a Hookable property.');
      }
      var hooks = Hooks.retrieve(object, key);
      priority = priority || 100;
      hooks[hookType].add(hook, priority);
    };
    /**
     * @function define
     * @memberOf BeautifulProperties.Hookable
     *
     * @param {object} object
     * @param {string} key
     * @param {(BeautifulProperties~DataDescriptor|BeautifulProperties~AccessorDescriptor|BeautifulProperties~GenericDescriptor)=} descriptor
     *  descriptor.writable's default value is false in ES5,but it's true in BeautifulProperties.Hookable.
     */
    Hookable.define = function defineHookableProperty(object, key, descriptor) {
      var Undefined = Hookable.Undefined;
      descriptor = descriptor || Object.create(null);
      var type = Descriptor.getTypeOf(descriptor);
      if (type === Descriptor.Types.InvalidDescriptor) {
        throw Descriptor.createTypeError(descriptor);
      }
      var storeDescriptor = Descriptor.store.bind(null, object, key);
      var storedDescriptor = Descriptor.retrieve(object, key);
      if (storedDescriptor) {
        // no change
        if (Descriptor.equals(descriptor, storedDescriptor)) {
          return;
        }
        var storedDescriptorType = Descriptor.getTypeOf(storedDescriptor);
        if (!storedDescriptor.configurable) {
          var isModified = function (descriptor) {
            // only for data property.
            if (storedDescriptorType === Descriptor.Types.AccessorDescriptor) {
              return false;
            }
            if (!storedDescriptor.writable) {
              return false;
            }
            if (type !== Descriptor.Types.GenericDescriptor && type !== storedDescriptorType) {
              return false;
            }
            descriptor = Descriptor.applyDefault(storedDescriptorType, descriptor, storedDescriptor);
            // except writable&value
            var keys = 'configurable enumerable init'.split(' ');
            for (var i = 0; i < keys.length; i++) {
              if (descriptor[keys[i]] !== storedDescriptor[keys[i]]) {
                return false;
              }
            }
            // store the overrided descriptor
            storeDescriptor(descriptor);
            return true;
          }(descriptor);
          if (isModified) {
            return;
          } else {
            throw new TypeError('Cannot redefine property: ' + key);
          }
        }
        // configurable:true
        if (type === Descriptor.Types.GenericDescriptor || type === storedDescriptorType) {
          // generic or same type
          (function (descriptor) {
            var genericDescriptor;
            if (type === Descriptor.Types.GenericDescriptor) {
              genericDescriptor = descriptor;
            } else {
              genericDescriptor = Object.create(null);
              'configurable enumerable'.split(' ').forEach(function (key) {
                if (descriptor[key] !== undefined) {
                  genericDescriptor[key] = descriptor[key];
                }
              });
            }
            Object.defineProperty(object, key, genericDescriptor);
          }(descriptor));
          (function (descriptor) {
            descriptor = Descriptor.applyDefault(storedDescriptorType, descriptor, storedDescriptor);
            // store the overrided descriptor
            storeDescriptor(descriptor);
          }(descriptor));
          return;
        } else {
          // different type
          (function (descriptor) {
            var genericDescriptor = Object.create(null);
            'configurable enumerable'.split(' ').forEach(function (key) {
              if (descriptor[key] !== undefined) {
                genericDescriptor[key] = descriptor[key];
              }
            });
            Object.defineProperty(object, key, genericDescriptor);
          }(descriptor));
          (function (descriptor) {
            var genericDescriptor = Object.create(null);
            'configurable enumerable'.split(' ').forEach(function (key) {
              if (descriptor[key] !== undefined) {
                genericDescriptor[key] = storedDescriptorType[key];
              }
              descriptor = Descriptor.applyDefault(type, descriptor, genericDescriptor);
              // store the overrided descriptor
              storeDescriptor(descriptor);
            });
          }(descriptor));
        }
        return;
      } else {
        switch (type) {
        case Descriptor.Types.DataDescriptor:
        case Descriptor.Types.GenericDescriptor:
          descriptor = Descriptor.applyDefault(Descriptor.Types.DataDescriptor, descriptor, { writable: true });
          type = Descriptor.Types.DataDescriptor;
          break;
        case Descriptor.Types.AccessorDescriptor:
          descriptor = Descriptor.applyDefault(Descriptor.Types.AccessorDescriptor, descriptor);
          break;
        default:
          break;
        }
        // create hooks
        Hooks.retrieve(object, key);
        storeDescriptor(descriptor);
      }
      // internal functions
      function init_DataDescriptor() {
        var descriptor = Descriptor.retrieve(object, key);
        var status = Status.retrieve(this, key);
        var isValueExist = descriptor.value !== undefined;
        status.isInitialized = true;
        var initialValue;
        if (descriptor.init) {
          initialValue = descriptor.init.call(this);
        } else if (isValueExist) {
          initialValue = descriptor.value;
        }
        if (descriptor.writable) {
          this[key] = initialValue;
        } else {
          Raw.store(this, key, initialValue);
        }
      }
      function get_beforeGet() {
        var self = this;
        var storedHooks = Hooks.retrieve(object, key);
        storedHooks.beforeGet.forEach(function (beforeGet) {
          beforeGet.call(self);
        });
      }
      function get_afterGet(val) {
        var self = this;
        var storedHooks = Hooks.retrieve(object, key);
        storedHooks.afterGet.forEach(function (afterGet) {
          var replacedVal = afterGet.call(self, val);
          if (replacedVal === undefined && replacedVal !== Undefined) {
          } else if (replacedVal === Undefined) {
            val = undefined;
          } else {
            val = replacedVal;
          }
        });
        return val;
      }
      function set_beforeSet(val, previousVal) {
        var self = this;
        var storedHooks = Hooks.retrieve(object, key);
        storedHooks.beforeSet.forEach(function (beforeSet) {
          var replacedVal = beforeSet.call(self, val, previousVal);
          if (replacedVal === undefined && replacedVal !== Undefined) {
          } else if (replacedVal === Undefined) {
            val = undefined;
          } else {
            val = replacedVal;
          }
        });
        return val;
      }
      function set_afterSet(val, previousVal) {
        var self = this;
        var storedHooks = Hooks.retrieve(object, key);
        storedHooks.afterSet.forEach(function (afterSet) {
          afterSet.call(self, val, previousVal);
        });
      }
      Object.defineProperty(object, key, {
        get: function __BeautifulProperties_Hookable_get() {
          var descriptor = Descriptor.retrieve(object, key);
          var type = Descriptor.getTypeOf(descriptor);
          var status = Status.retrieve(this, key);
          switch (type) {
          case Descriptor.Types.DataDescriptor:
            var isValueExist = descriptor.value !== undefined;
            if (!status.isInitialized && (descriptor.init || isValueExist)) {
              init_DataDescriptor.call(this);
              return this[key];
            } else {
              get_beforeGet.call(this);
              return get_afterGet.call(this, Raw.retrieve(this, key));
            }
          case Descriptor.Types.AccessorDescriptor:
            // write only
            if (!descriptor.get) {
              return undefined;
            }
            get_beforeGet.call(this);
            Get.refreshProperty(this, key);
            return get_afterGet.call(this, Raw.retrieve(this, key));
          default:
            throw new Error('InvalidState');
          }
        },
        set: function __BeautifulProperties_Hookable_set(val) {
          var descriptor = Descriptor.retrieve(object, key);
          var type = Descriptor.getTypeOf(descriptor);
          switch (type) {
          case Descriptor.Types.DataDescriptor:
            // read only
            if (!descriptor.writable) {
              return;
            }
            var status = Status.retrieve(this, key);
            if (!status.isInitialized) {
              status.isInitialized = true;
            }
            var previousVal = Raw.retrieve(this, key);
            val = set_beforeSet.call(this, val, previousVal);
            Raw.store(this, key, val);
            set_afterSet.call(this, val, previousVal);
            break;
          case Descriptor.Types.AccessorDescriptor:
            // read only
            if (!descriptor.set) {
              return;
            }
            var previousVal = Raw.retrieve(this, key);
            val = set_beforeSet.call(this, val, previousVal);
            descriptor.set.call(this, val);
            if (descriptor.get) {
              Get.refreshProperty(this, key);
            }
            set_afterSet.call(this, val, previousVal);
            break;
          default:
            throw new Error('InvalidState');
          }
        },
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable
      });
    };
  }(Hookable_namespace, Hookable_Get, Hookable_Raw, Hookable_Status, Hookable_Hooks, Hookable_Descriptor);
  Hookable = function (Hookable) {
    return Hookable;
  }(Hookable_namespace);
  Events_namespace = function (BeautifulProperties, createChildNamespace) {
    /**
     * @namespace Events
     * @memberOf BeautifulProperties
     */
    return createChildNamespace(BeautifulProperties, 'Events');
  }(namespace, utils_createChildNamespace);
  Events_Event = function (Events, hasConsoleError) {
    /**
     * @typedef BeautifulProperties.Events.Event~options
     * @property {string} type
     * @property {object} target
     * @property {boolean=} bubbles
     * @description Options for BeautifulProperties.Events.Event constructor.
     */
    var readonlyKeys = 'type target'.split(' ');
    var necessaryKeys = 'type target'.split(' ');
    var optionalKeys = 'bubbles'.split(' ');
    /**
     *
     * @param {BeautifulProperties.Events.Event~options} options
     * @constructor Event
     * @memberOf BeautifulProperties.Events
     */
    function Event(options) {
      var event = this;
      necessaryKeys.forEach(function (key) {
        if (!(key in options)) {
          if (hasConsoleError) {
            console.error(key + ' is necessary in Event\'s options.', options);
          }
          throw new Error(key + ' is necessary in Event\'s options.');
        }
        event[key] = options[key];
      });
      optionalKeys.forEach(function (key) {
        if (!(key in options)) {
          return;
        }
        event[key] = options[key];
      });
      readonlyKeys.forEach(function (key) {
        Object.defineProperty(event, key, { writable: false });
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
       * @type {object?}
       * @name currentTarget
       * @memberOf BeautifulProperties.Events.Event#
       */
      this.currentTarget = null;
      /**
       * @type {object?}
       * @name previousTarget
       * @memberOf BeautifulProperties.Events.Event#
       * @description Previous `currentTarget` in bubbling phase.
       */
      /**
       * @function stopPropagation
       * @memberOf BeautifulProperties.Events.Event#
       */
      proto.stopPropagation = function stopPropagation() {
        this.isPropagationStopped = true;
      };
    }(Event.prototype));
    Events.Event = Event;
    return Event;
  }(Events_namespace, utils_hasConsoleError);
  Events_Ancestor = function (Events, InternalObject, createChildNamespace) {
    /**
     * @namespace Ancestor
     * @memberOf BeautifulProperties.Events
     */
    var Ancestor = createChildNamespace(Events, 'Ancestor');
    var namespace = 'Events.Ancestor';
    /**
     * @callback BeautifulProperties.Events.Ancestor~ancestorRetriever
     * @param {object} object target object
     * @param {BeautifulProperties.Events.Event} event
     * @returns {object|null|undefined}
     * @description The function to retrieve the ancestor of given object.
     */
    /**
     *
     * @function setRetriever
     * @memberOf BeautifulProperties.Events.Ancestor
     * @param {object} object target object
     * @param {BeautifulProperties.Events.Ancestor~ancestorRetriever} ancestorRetriever
     */
    Ancestor.setRetriever = function set(object, ancestorRetriever) {
      InternalObject.register(object, namespace, ancestorRetriever);
    };
    /**
     *
     * @function retrieve
     * @memberOf BeautifulProperties.Events.Ancestor
     * @param {object} object target object
     * @param {BeautifulProperties.Events.Event}
     * @returns {object|null} the ancestor of the target object
     * @description Retrieve the ancestor of the target object by the ancestorRetriever that set on the target object.
     * If the target object don't have ancestorRetriever or the ancestorRetriever returns undefined,
     * the method returns the prototype of the target object.
     */
    Ancestor.retrieve = function retrieve(object, event) {
      var retriever = InternalObject.retrieve(namespace, false, object);
      var ancestor;
      if (retriever) {
        ancestor = retriever(object, event);
      }
      if (ancestor === undefined) {
        ancestor = Object.getPrototypeOf(object);
      }
      return ancestor;
    };
    return Ancestor;
  }(Events_namespace, InternalObject, utils_createChildNamespace);
  Events_HandlerCollection = function (NamespacedKVS) {
    var namespace = 'Events:HandlerCollection';
    var proto = Object.create(null);
    /**
     * @function add
     * @memberOf BeautifulProperties.Events~HandlerCollection#
     * @param {function} handler
     * @param {object=} context
     */
    proto.add = function add(handler, context) {
      this.push(handler);
      this.contexts.push(context);
    };
    /**
     * @function remove
     * @memberOf BeautifulProperties.Events~HandlerCollection#
     * @param {function} handler
     */
    proto.remove = function remove(handler) {
      var index;
      while ((index = this.indexOf(handler)) !== -1) {
        this.splice(index, 1);
        this.contexts.splice(index, 1);
      }
    };
    /**
     * @function clear
     * @memberOf BeautifulProperties.Events~HandlerCollection#
     */
    proto.clear = function clear() {
      this.length = 0;
      this.contexts.length = 0;
    };
    /**
     * @function clone
     * @memberOf BeautifulProperties.Events~HandlerCollection#
     */
    proto.clone = function clone() {
      var clone = new HandlerCollection();
      var length = this.length;
      for (var i = 0; i < length; i++) {
        clone[i] = this[i];
        clone.contexts[i] = this.contexts[i];
      }
      return clone;
    };
    /**
     * @constructor BeautifulProperties.Events~HandlerCollection
     * @extends Array.<function>
     * @private
     */
    function HandlerCollection() {
      var self = [];
      Object.keys(proto).forEach(function (key) {
        self[key] = proto[key];
      });
      self.contexts = [];
      return self;
    }
    NamespacedKVS.mixinNamespace(namespace, HandlerCollection);
    HandlerCollection.retrieve = NamespacedKVS.retrieveFnFactory(namespace, false);
    HandlerCollection.retrieveWithCreate = NamespacedKVS.retrieveFnFactory(namespace, true);
    HandlerCollection.remove = NamespacedKVS.removeFnFactory(namespace);
    HandlerCollection.keys = NamespacedKVS.keysFnFactory(namespace);
    return HandlerCollection;
  }(InternalObject_NamespacedKVS);
  Events_bindImpl = function (Events, Event, Ancestor, HandlerCollection) {
    /**
     * @function on
     * @memberOf BeautifulProperties.Events
     *
     * @param {object} object
     * @param {string} eventType
     * @param {function} handler
     * @param {{context:*=}=} options `context` is the ThisBinding of the handler execution context.
     */
    Events.on = function on(object, eventType, handler, options) {
      options = options || Object.create(null);
      var context = options.context || null;
      if (!handler) {
        throw new Error('handler is necessary in BeautifulProperties.Events.on');
      }
      var handlers = HandlerCollection.retrieveWithCreate(object, eventType);
      handlers.add(handler, context);
    };
    /**
     * @function off
     * @memberOf BeautifulProperties.Events
     *
     * @param {object} object
     * @param {string} eventType
     * @param {function} handler
     *
     * @description <pre>Remove callbacks.
     * If `handler` is null, removes all handlers for the eventType.
     * If `eventType` is null, removes all bound handlers for all events.</pre>
     */
    Events.off = function off(object, eventType, handler) {
      var registeredEventTypes = HandlerCollection.keys(object);
      // No eventType, or removing *all* eventType.
      if (registeredEventTypes.length === 0) {
        return;
      }
      var eventTypes = eventType ? [eventType] : registeredEventTypes;
      eventTypes.forEach(function (eventType) {
        var handlers = HandlerCollection.retrieve(object, eventType);
        if (!handlers) {
          return;
        }
        if (handler) {
          handlers.remove(handler);
        } else {
          handlers.clear();
          HandlerCollection.remove(object, eventType);
        }
      });
    };
  }(Events_namespace, Events_Event, Events_Ancestor, Events_HandlerCollection);
  utils_cloneDict = function () {
    /**
     *
     * @param {object} source
     * @returns {object}
     * @inner
     */
    function cloneDict(source) {
      var target = Object.create(null);
      for (var key in source) {
        target[key] = source[key];
      }
      return target;
    }
    return cloneDict;
  }();
  Events_triggerImpl = function (Events, Event, Ancestor, HandlerCollection, Array_from, cloneDict) {
    var toString = Object.prototype.toString;
    /**
     * @function trigger
     * @memberOf BeautifulProperties.Events
     *
     * @param {object} object
     * @param {string|BeautifulProperties.Events.Event~options} eventType
     * @description  <pre>Trigger one or many events, firing all bound callbacks. Callbacks are
     * passed the same arguments as `trigger` is, apart from the event name.</pre>
     */
    Events.trigger = function trigger(object, eventType) {
      var rest = Array_from(arguments).slice(2);
      var target = object;
      var currentTarget = object;
      var event;
      if (toString.call(eventType) == '[object String]') {
        event = new Event({
          type: eventType,
          target: target
        });
      } else {
        // eventType is a BeautifulProperties.Events.Event~options.
        event = new Event(function () {
          var options = cloneDict(eventType);
          options.target = target;
          return options;
        }());
      }
      var previousTarget = null;
      var handlers;
      do {
        event.previousTarget = previousTarget;
        event.currentTarget = currentTarget;
        if (target !== currentTarget && !event.bubbles) {
          // no bubbling
          break;
        }
        handlers = HandlerCollection.retrieve(currentTarget, event.type);
        // no callbacks
        if (!handlers || handlers.length === 0) {
          continue;
        }
        // Copy handler lists to prevent modification.
        handlers = handlers.clone();
        handlers.forEach(function (handler, index) {
          var context = handlers.contexts[index];
          if (context === null) {
            context = target;
          }
          handler.apply(context, [event].concat(rest));
        });
        if (!event.bubbles || event.isPropagationStopped) {
          break;
        }
      } while (previousTarget = currentTarget, currentTarget = Ancestor.retrieve(currentTarget, event));
      event.currentTarget = null;
    };
  }(Events_namespace, Events_Event, Events_Ancestor, Events_HandlerCollection, utils_Array_from, utils_cloneDict);
  Events_impl = function (Events, provideMethodsFactory) {
    /**
     * @function provideMethods
     * @memberOf BeautifulProperties.Events
     *
     * @param {object} object
     */
    Events.provideMethods = provideMethodsFactory(Events, [
      'on',
      'off',
      'trigger'
    ]);
  }(Events_namespace, utils_provideMethodsFactory);
  Events = function (Events) {
    return Events;
  }(Events_namespace);
  Equals_namespace = function (BeautifulProperties, createChildNamespace) {
    /**
     * @namespace Equals
     * @memberOf BeautifulProperties
     */
    return createChildNamespace(BeautifulProperties, 'Equals');
  }(namespace, utils_createChildNamespace);
  Equals_Functions = function (Equals, createChildNamespace) {
    /**
     * @name Functions
     * @namespace
     * @memberOf BeautifulProperties.Equals
     * @see BeautifulProperties.Equals.equals
     */
    var Functions = createChildNamespace(Equals, 'Functions');
    /**
     * @function StrictEqual
     * @memberOf BeautifulProperties.Equals.Functions
     *
     * @param {*} value
     * @param {*} otherValue
     * @returns {boolean}
     * @description ===
     */
    Functions.StrictEqual = function StrictEqual(value, otherValue) {
      return value === otherValue;
    };
    return Functions;
  }(Equals_namespace, utils_createChildNamespace);
  Equals_impl = function (Equals, Functions, NamespacedKVS, PrototypeWalker) {
    NamespacedKVS.mixinNamespace('Equals');
    var store = NamespacedKVS.storeFnFactory('Equals');
    /**
     * @function set
     * @memberOf BeautifulProperties.Equals
     * @see BeautifulProperties.Equals.equals
     *
     * @param {object} object
     * @param {string} key
     * @param {function(*,*):boolean} equalsFn equals function for BeautifulProperties.Equals.equals.
     * @description It set the equals function on the property.
     */
    Equals.set = function set(object, key, equalsFn) {
      equalsFn = equalsFn || Functions.StrictEqual;
      store(object, key, equalsFn);
    };
    var walkAndRetrieve = PrototypeWalker.retrieve.bind(null, 'Equals');
    /**
     * @function equals
     * @memberOf BeautifulProperties.Equals
     *
     * @param {object} object
     * @param {string} key
     * @param {*} value
     * @param {*} otherValue
     * @returns {boolean}
     * @description If it returns true,value is equal to otherValue in the property.
     */
    Equals.equals = function equals(object, key, value, otherValue) {
      var equalsFn = walkAndRetrieve(object, key);
      if (!equalsFn) {
        return value === otherValue;
      }
      if (equalsFn === Functions.StrictEqual) {
        return value === otherValue;
      }
      return equalsFn.call(object, value, otherValue);
    };
  }(Equals_namespace, Equals_Functions, InternalObject_NamespacedKVS, InternalObject_PrototypeWalker);
  Equals = function (Equals) {
    return Equals;
  }(Equals_namespace);
  Observable_namespace = function (BeautifulProperties, createChildNamespace) {
    /**
     * @namespace Observable
     * @memberOf BeautifulProperties
     */
    return createChildNamespace(BeautifulProperties, 'Observable');
  }(namespace, utils_createChildNamespace);
  Observable_impl = function (Observable, Events, Equals, Hookable, Descriptor, cloneDict) {
    // internal functions
    var trigger = Events.trigger.bind(Events);
    /**
     * @function define
     * @memberOf BeautifulProperties.Observable
     * @see BeautifulProperties.Equals.equals
     * @see BeautifulProperties.Events.Event~options
     *
     * @param {object} object
     * @param {string} key
     * @param {{bubbles:boolean=}=} options part of BeautifulProperties.Events.Event~options.
     * @description This method can be use after Hookable.define.
     */
    Observable.define = function defineObservableProperty(object, key, options) {
      options = options || Object.create(null);
      // Observable property depends on Hookable.
      if (!Hookable.hasHooks(object, key)) {
        Hookable.define(object, key);
      }
      var descriptor = Descriptor.retrieve(object, key);
      function checkChangeAndTrigger(val, previousVal) {
        if (!Equals.equals(this, key, val, previousVal)) {
          var eventOptions = cloneDict(options);
          eventOptions.type = 'change:' + key;
          trigger(this, eventOptions, val, previousVal);
        }
      }
      var hookType = descriptor.get ? 'refresh' : 'afterSet';
      Hookable.addHook(object, key, hookType, checkChangeAndTrigger, 1);
    };
  }(Observable_namespace, Events, Equals, Hookable, Hookable_Descriptor, utils_cloneDict);
  Observable = function (Observable) {
    return Observable;
  }(Observable_namespace);
  Versionizable_namespace = function (BeautifulProperties, createChildNamespace) {
    /**
     * @namespace Versionizable
     * @memberOf BeautifulProperties
     */
    return createChildNamespace(BeautifulProperties, 'Versionizable');
  }(namespace, utils_createChildNamespace);
  Versionizable_Version = function (Versionizable) {
    /**
     * @constructor Version
     * @memberOf BeautifulProperties.Versionizable
     *
     * @property {boolean} isNull
     * @property {*} value
     * @property {number} timestamp
     */
    function Version() {
    }
    Object.defineProperty(Version.prototype, 'isNull', {
      value: false,
      writable: true
    });
    Versionizable.Version = Version;
    return Version;
  }(Versionizable_namespace);
  Versionizable_History = function (NamespacedKVS) {
    var proto = Object.create(null);
    /**
     *
     * @constructor BeautifulProperties.Versionizable~History
     * @extends Array.<BeautifulProperties.Versionizable.Version>
     * @private
     */
    function History() {
      var self = [];
      Object.keys(proto).forEach(function (key) {
        self[key] = proto[key];
      });
      return self;
    }
    NamespacedKVS.mixinNamespace('Versionizable::History', History);
    /**
     * @function retrieve
     * @memberOf BeautifulProperties.Versionizable~History
     * @param {object} object
     * @param {string} key
     * @returns BeautifulProperties.Versionizable~History
     */
    History.retrieve = NamespacedKVS.retrieveFnFactory('Versionizable::History', true);
    return History;
  }(InternalObject_NamespacedKVS);
  Versionizable_Transaction = function (Versionizable, Version, History) {
    /**
     * @constructor Transaction
     * @memberOf BeautifulProperties.Versionizable
     *
     * @param {object} object
     * @param {string} key
     *
     * @property {object} object
     * @property {string} key
     */
    function Transaction(object, key) {
      Object.defineProperties(this, {
        object: {
          value: object,
          writable: false,
          configurable: false
        },
        key: {
          value: key,
          writable: false,
          configurable: false
        }
      });
    }
    /**
     * @function insert
     * @memberOf BeautifulProperties.Versionizable.Transaction#
     *
     * @param {number} index
     * @param {*} value
     * @param {{timestamp:number=}=} options
     */
    Transaction.prototype.insert = function insert(index, value, options) {
      var history = History.retrieve(this.object, this.key);
      var version = new Version();
      version.value = value;
      version.timestamp = options && options.timestamp || Date.now();
      history.splice(index, 0, version);
    };
    /**
     * @function remove
     * @memberOf BeautifulProperties.Versionizable.Transaction#
     *
     * @param {BeautifulProperties.Versionizable.Version} version
     */
    Transaction.prototype.remove = function remove(version) {
      var history = History.retrieve(this.object, this.key);
      var index = history.indexOf(version);
      if (index === -1) {
        return;
      }
      history.splice(index, 1);
    };
    Versionizable.Transaction = Transaction;
    return Transaction;
  }(Versionizable_namespace, Versionizable_Version, Versionizable_History);
  Versionizable_impl = function (Versionizable, Version, Transaction, History, Hookable, Descriptor, Equals, Events) {
    /**
     * @function getHistoryLength
     * @memberOf BeautifulProperties.Versionizable
     *
     * @param {object} object
     * @param {string} key
     * @returns {number}
     */
    Versionizable.getHistoryLength = function getHistoryLength(object, key) {
      var history = History.retrieve(object, key);
      return history.length;
    };
    var aNullVersion = new Version();
    (function (version) {
      Object.defineProperty(version, 'isNull', {
        value: true,
        writable: false
      });
      Object.defineProperty(version, 'value', {
        value: undefined,
        writable: false
      });
    }(aNullVersion));
    /**
     * @function getVersions
     * @memberOf BeautifulProperties.Versionizable
     *
     * @param {object} object
     * @param {string} key
     * @returns {Array.<BeautifulProperties.Versionizable.Version>}
     */
    Versionizable.getVersions = function getVersions(object, key) {
      var history = History.retrieve(object, key);
      return history.slice();
    };
    /**
     * @function getVersion
     * @memberOf BeautifulProperties.Versionizable
     *
     * @param {object} object
     * @param {string} key
     * @param {number} index
     * @returns {BeautifulProperties.Versionizable.Version}
     */
    Versionizable.getVersion = function getVersion(object, key, index) {
      var history = History.retrieve(object, key);
      return history[index] || aNullVersion;
    };
    /**
     * @function undo
     * @memberOf BeautifulProperties.Versionizable
     *
     * @param {object} object
     * @param {string} key
     * @param {BeautifulProperties.Versionizable.Version} version
     */
    Versionizable.undo = function undo(object, key, version) {
      // Only for data property.
      this.transaction(object, key, function (versions) {
        var t = this;
        var targetIndex = versions.indexOf(version);
        if (versions.length <= 1 || targetIndex === -1) {
          return;
        }
        versions.filter(function (version, index) {
          return index < targetIndex;
        }).forEach(function (version) {
          t.remove(version);
        });
      }, function done(currentVersion, versions, currentVersionBeforeTransaction, versionsBeforeTransaction) {
        if (currentVersion !== currentVersionBeforeTransaction) {
          Events.trigger(object, 'undo:' + key, currentVersion.value, currentVersionBeforeTransaction.value);
        }
      });
    };
    /**
     * @callback BeautifulProperties.Versionizable~transactionCallback
     * @this BeautifulProperties.Versionizable.Transaction
     * @param {Array.<BeautifulProperties.Versionizable.Version>} versions
     */
    /**
     * @callback BeautifulProperties.Versionizable~doneCallback
     * @param {BeautifulProperties.Versionizable.Version} currentVersion
     * @param {Array.<BeautifulProperties.Versionizable.Version>} versions
     * @param {BeautifulProperties.Versionizable.Version} currentVersionBeforeTransaction
     * @param {Array.<BeautifulProperties.Versionizable.Version>} versionsBeforeTransaction
     */
    /**
     * @function transaction
     * @memberOf BeautifulProperties.Versionizable
     *
     * @param {object} object
     * @param {string} key
     * @param {BeautifulProperties.Versionizable~transactionCallback} callback
     * @param {BeautifulProperties.Versionizable~doneCallback=} doneCallback
     * @description The method modify property's history.<br/>
     * It's experimental API.
     */
    Versionizable.transaction = function transaction(object, key, callback, doneCallback) {
      var currentVersionBeforeTransaction = this.getVersion(object, key, 0);
      var versionsBeforeTransaction = this.getVersions(object, key);
      callback.call(new Transaction(object, key), versionsBeforeTransaction);
      var currentVersion = this.getVersion(object, key, 0);
      var versions = this.getVersions(object, key);
      if (currentVersion.isNull && !currentVersionBeforeTransaction.isNull || !currentVersion.isNull && currentVersionBeforeTransaction.isNull || !Equals.equals(this, key, currentVersion.value, currentVersionBeforeTransaction.value)) {
        Hookable.setRaw(object, key, currentVersion.value);
      }
      if (doneCallback) {
        doneCallback(currentVersion, versions, currentVersionBeforeTransaction, versionsBeforeTransaction);
      }
    };
    /**
     * @function getPreviousValue
     * @memberOf BeautifulProperties.Versionizable
     *
     * @param {object} object
     * @param {string} key
     * @returns {*}
     */
    Versionizable.getPreviousValue = function getPreviousValue(object, key) {
      var history = History.retrieve(object, key);
      return (history[1] || aNullVersion).value;
    };
    /**
     * @function define
     * @memberOf BeautifulProperties.Versionizable
     * @see BeautifulProperties.Equals.equals
     *
     * @param {object} object
     * @param {string} key
     * @param {{length:number=}=} options length's default value is 2.
     * @description This method can be use after Hookable.define.
     */
    Versionizable.define = function define(object, key, options) {
      options = options || Object.create(null);
      if (options.length === undefined) {
        options.length = 2;
      }
      // Versionizable property depends on Hookable.
      if (!Hookable.hasHooks(object, key)) {
        Hookable.define(object, key);
      }
      var descriptor = Descriptor.retrieve(object, key);
      function checkChangeAndEnqueue(val, previousVal) {
        if (!Equals.equals(this, key, val, previousVal)) {
          var history = History.retrieve(this, key);
          var version = new Version();
          version.value = val;
          version.timestamp = Date.now();
          history.unshift(version);
          // truncate
          if (history.length > options.length) {
            history.length = options.length;
          }
        }
      }
      var hookType = descriptor.get ? 'refresh' : 'afterSet';
      Hookable.addHook(object, key, hookType, checkChangeAndEnqueue, 10000);
    };
  }(Versionizable_namespace, Versionizable_Version, Versionizable_Transaction, Versionizable_History, Hookable, Hookable_Descriptor, Equals, Events);
  Versionizable = function (Versionizable) {
    return Versionizable;
  }(Versionizable_namespace);
  deprecated_Internal = function (BeautifulProperties, createChildNamespace, InternalObject) {
    /**
     * @namespace Internal
     * @memberOf BeautifulProperties
     * @deprecated since version 0.1.9
     */
    var Internal = createChildNamespace(BeautifulProperties, 'Internal');
    BeautifulProperties.Internal.Key = InternalObject.Key;
    BeautifulProperties.Internal.retrieve = InternalObject.retrieve;
    return Internal;
  }(namespace, utils_createChildNamespace, InternalObject);
  deprecated_since019 = function (Hookable) {
    /**
     * @function addHooks
     * @memberOf BeautifulProperties.Hookable
     *
     * @param {object} object
     * @param {string} key
     * @param {{beforeGet:function=,afterGet:function=,beforeSet:function=,afterSet:function=,refresh:function=}} hooks
     * @see BeautifulProperties.Hookable.addHook
     * @deprecated since version 0.1.9
     */
    Hookable.addHooks = function addHooks(object, key, hooks) {
      if (!Hookable.hasHooks(object, key)) {
        throw new TypeError('The property (key:' + key + ') is not a Hookable property. Hookable.addHooks is the method for a Hookable property.');
      }
      'beforeGet afterGet beforeSet afterSet refresh'.split(' ').forEach(function (hookType) {
        if (hooks[hookType]) {
          Hookable.addHook(object, key, hookType, hooks[hookType]);
        }
      });
    };
  }(Hookable);
  deprecated = undefined;
  BeautifulProperties = function (BeautifulProperties) {
    /**
     * @constant
     * @name VERSION
     * @memberOf BeautifulProperties
     */
    Object.defineProperty(BeautifulProperties, 'VERSION', {
      value: '0.1.11',
      writable: false
    });
    return BeautifulProperties;
  }(namespace);
  return BeautifulProperties;
}.call(this);