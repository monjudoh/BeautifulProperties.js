define('Hookable/impl',[
  './namespace','./Get',
  './Raw','./Status','./Hooks', './Descriptor', './Undefined', './internal',
  './alias'
],function (Hookable,Get,
            Raw,Status,Hooks, Descriptor, Undefined, internal) {

  /**
   * @name Undefined
   * @memberOf BeautifulProperties.Hookable
   */
  Hookable.Undefined = Undefined;

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
  Hookable.addHook = function addHook(object,key,hookType,hook,priority){
    if (!Hooks.has(object,key)) {
      throw new TypeError('The property (key:'+key+') is not a Hookable property. Hookable.addHook is the method for a Hookable property.');
    }
    var hooks = Hooks.retrieve(object,key);
    priority = priority || 100;
    hooks[hookType].add(hook,priority);
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
  Hookable.define = function defineHookableProperty(object,key,descriptor) {
    descriptor = descriptor || Object.create(null);
    var type = Descriptor.getTypeOf(descriptor);
    if (type === Descriptor.Types.InvalidDescriptor) {
      throw Descriptor.createTypeError(descriptor);
    }

    var storeDescriptor = Descriptor.store.bind(null,object,key);
    var storedDescriptor = Descriptor.retrieve(object,key);
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
      Hooks.retrieve(object,key);
      storeDescriptor(descriptor);
    }
    Object.defineProperty(object,key,{
      get : function __BeautifulProperties_Hookable_get() {
        var descriptor = Descriptor.retrieve(object,key);
        var type = Descriptor.getTypeOf(descriptor);
        var status = Status.retrieve(this,key);
        switch (type) {
          case Descriptor.Types.DataDescriptor:
            if (!status.isInitialized) {
              (internal.init_DataDescriptor)(this,key,Undefined,object);
              if (!status.isInitialized) {
                return;
              }
            }
            (internal.get_beforeGet)(this,key,object);
            return (internal.get_afterGet)(this,key,Raw.retrieve(this,key),object);
          case Descriptor.Types.AccessorDescriptor:
            // write only
            if (!descriptor.get) {
              return undefined;
            }
            var isInitialized = status.isInitialized;
            if (!isInitialized) {
              (internal.init_AccessorDescriptor)(this, key, object);
            }
            (internal.get_beforeGet)(this,key,object);
            if (isInitialized) {
              (internal.get_refreshProperty)(this, key, object);
            }
            return (internal.get_afterGet)(this,key,Raw.retrieve(this,key),object);
          default :
            throw new Error('InvalidState');
        }
      },
      set : function __BeautifulProperties_Hookable_set(val) {
        var descriptor = Descriptor.retrieve(object,key);
        var type = Descriptor.getTypeOf(descriptor);
        var status = Status.retrieve(this,key);
        switch (type) {
          case Descriptor.Types.DataDescriptor:
            // read only
            if (!descriptor.writable) {
              return;
            }
            if (!status.isInitialized) {
              (internal.init_DataDescriptor)(this,key,val,object);
              return;
            }
            var previousVal = Raw.retrieve(this,key);
            val = (internal.set_beforeSet)(this,key,val,previousVal,object);
            Raw.store(this,key,val);
            (internal.set_afterSet)(this,key,val,previousVal,object);
            break;
          case Descriptor.Types.AccessorDescriptor:
            // read only
            if (!descriptor.set) {
              return;
            }
            var previousVal;
            // write only
            if (!descriptor.get) {
              previousVal = undefined;
              val = (internal.set_beforeSet)(this,key,val,previousVal,object);
              descriptor.set.call(this,val);
              // can't refresh
              (internal.set_afterSet)(this,key,val,previousVal,object);
              return;
            }
            // read/write
            if (status.isInitialized) {
              previousVal = Raw.retrieve(this,key);
              val = (internal.set_beforeSet)(this,key,val,previousVal,object);
              descriptor.set.call(this,val);
              (internal.get_refreshProperty)(this, key, object);
              (internal.set_afterSet)(this,key,val,previousVal,object);
            } else {
              (internal.init_AccessorDescriptor)(this, key, object);
              this[key] = val;
            }

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