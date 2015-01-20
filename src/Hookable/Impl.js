define('Hookable/impl',[
  './namespace','./Get','./Internal','./retrieveDescriptor',
  'internal/Descriptor',
  'InternalObject/PropertySpecific','InternalObject/retrieve'
],function (Hookable,Get,Internal,retrieveDescriptor,
            Descriptor,
            PropertySpecific,retrieveInternalObject) {
  var retrieveMeta = Internal.retrieveMeta;
  var retrieveHooks = Internal.retrieveHooks;

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
  Hookable.getRaw = Internal.getRaw;

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
  Hookable.setRaw = Internal.setRaw;
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
   * @param {(BeautifulProperties~DataDescriptor|BeautifulProperties~AccessorDescriptor|BeautifulProperties~GenericDescriptor)=} descriptor
   *  descriptor.writable's default value is false in ES5,but it's true in BeautifulProperties.Hookable.
   */
  Hookable.define = function defineHookableProperty(object,key,descriptor) {
    var Undefined = Hookable.Undefined;

    descriptor = descriptor || Object.create(null);
    var type = Descriptor.getTypeOf(descriptor);
    if (type === Descriptor.Types.InvalidDescriptor) {
      throw Descriptor.createTypeError(descriptor);
    }
    function storeDescriptor(descriptor){
      retrieveInternalObject.bind(null,'Hookable::Descriptor',true)(object).store(key,descriptor);
    }
    var storedDescriptor = retrieveDescriptor(object,key);
    if (storedDescriptor) {
      // no change
      if (Descriptor.equals(descriptor,storedDescriptor)) {
        return;
      }
      var storedDescriptorType = Descriptor.getTypeOf(storedDescriptor);
      if (!storedDescriptor.configurable) {
        var isModified = (function (descriptor) {
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
          descriptor = Descriptor.applyDefault(storedDescriptorType,descriptor,storedDescriptor);
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
        })(descriptor);
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
            "configurable enumerable".split(' ').forEach(function (key) {
              if (descriptor[key] !== undefined) {
                genericDescriptor[key] = descriptor[key];
              }
            });
          }
          Object.defineProperty(object,key,genericDescriptor);
        })(descriptor);
        (function (descriptor) {
          descriptor = Descriptor.applyDefault(storedDescriptorType,descriptor,storedDescriptor);
          // store the overrided descriptor
          storeDescriptor(descriptor);
        })(descriptor);
        return;
      } else {
        // different type
        (function (descriptor) {
          var genericDescriptor = Object.create(null);
          "configurable enumerable".split(' ').forEach(function (key) {
            if (descriptor[key] !== undefined) {
              genericDescriptor[key] = descriptor[key];
            }
          });
          Object.defineProperty(object,key,genericDescriptor);
        })(descriptor);
        (function (descriptor) {
          var genericDescriptor = Object.create(null);
          "configurable enumerable".split(' ').forEach(function (key) {
            if (descriptor[key] !== undefined) {
              genericDescriptor[key] = storedDescriptorType[key];
            }
            descriptor = Descriptor.applyDefault(type,descriptor,genericDescriptor);
            // store the overrided descriptor
            storeDescriptor(descriptor);
          });
        })(descriptor);
      }

      return;
    } else {
      switch (type) {
        case Descriptor.Types.DataDescriptor:
        case Descriptor.Types.GenericDescriptor:
          descriptor = Descriptor.applyDefault(Descriptor.Types.DataDescriptor,descriptor,{writable:true});
          type = Descriptor.Types.DataDescriptor;
          break;
        case Descriptor.Types.AccessorDescriptor:
          descriptor = Descriptor.applyDefault(Descriptor.Types.AccessorDescriptor,descriptor);
          break;
        default :
          break;
      }
      // create hooks
      retrieveHooks(object,key);
      storeDescriptor(descriptor);
    }
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
        Internal.setRaw(this,key,initialValue);
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
        var type = Descriptor.getTypeOf(descriptor);
        var meta = retrieveMeta(this,key);
        switch (type) {
          case Descriptor.Types.DataDescriptor:
            var isValueExist = descriptor.value !== undefined;
            if (!meta.isInited && (descriptor.init || isValueExist)) {
              init_DataDescriptor.call(this);
              return this[key];
            } else {
              get_beforeGet.call(this);
              return get_afterGet.call(this,Internal.getRaw(this,key));
            }
          case Descriptor.Types.AccessorDescriptor:
            // write only
            if (!descriptor.get) {
              return undefined;
            }
            get_beforeGet.call(this);
            Get.refreshProperty(this,key);
            return get_afterGet.call(this,Internal.getRaw(this,key));
          default :
            throw new Error('InvalidState');
        }
      },
      set : function __BeautifulProperties_Hookable_set(val) {
        var descriptor = retrieveDescriptor(object,key);
        var type = Descriptor.getTypeOf(descriptor);
        switch (type) {
          case Descriptor.Types.DataDescriptor:
            // read only
            if (!descriptor.writable) {
              return;
            }
            var meta = retrieveMeta(this,key);
            if (!meta.isInited) {
              meta.isInited = true;
            }
            var previousVal = Internal.getRaw(this,key);
            val = set_beforeSet.call(this,val,previousVal);
            Internal.setRaw(this,key,val);
            set_afterSet.call(this,val,previousVal);
            break;
          case Descriptor.Types.AccessorDescriptor:
            // read only
            if (!descriptor.set) {
              return;
            }
            var previousVal = Internal.getRaw(this,key);
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
      },
      enumerable:descriptor.enumerable,
      configurable:descriptor.configurable
    });
  };
});