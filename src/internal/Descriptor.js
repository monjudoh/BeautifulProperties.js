define('internal/Descriptor',function () {
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
   * @name Descriptor
   * @namespace
   * @memberOf Internal
   * @private
   */
  var Descriptor = Object.create(null);
  /**
   * @name Types
   * @memberOf Internal.Descriptor
   * @enum {object}
   */
  Descriptor.Types = {
    /**
     * http://www.ecma-international.org/ecma-262/5.1/#sec-8.10.3
     */
    GenericDescriptor:Object.create(null),
    /**
     * http://www.ecma-international.org/ecma-262/5.1/#sec-8.10.2
     */
    DataDescriptor:Object.create(null),
    /**
     * http://www.ecma-international.org/ecma-262/5.1/#sec-8.10.1
     */
    AccessorDescriptor:Object.create(null),
    /**
     * invalid
     */
    InvalidDescriptor:Object.create(null)
  };
  var AllDescriptorKeys = 'configurable enumerable writable value init get set'.split(' ');
  /**
   * @name equals
   * @memberOf Internal.Descriptor
   * @function
   *
   * @param descriptor
   * @param otherDescriptor
   * @returns {Internal.Descriptor.Types}
   */
  Descriptor.equals = function equals(descriptor,otherDescriptor){
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
   * @name getTypeOf
   * @memberOf Internal.Descriptor
   * @function
   *
   * @param descriptor
   * @returns {Internal.Descriptor.Types}
   */
  Descriptor.getTypeOf = function getTypeOf(descriptor){
    if (descriptor === undefined) {
      return Descriptor.Types.InvalidDescriptor;
    }
    var isDataDescriptor = descriptor.writable !== undefined || descriptor.value !== undefined || descriptor.init!== undefined;
    var isAccessorDescriptor = descriptor.get !== undefined || descriptor.set !== undefined;
    if (!isDataDescriptor && !isAccessorDescriptor) {
      return Descriptor.Types.GenericDescriptor;
    }
    if (isDataDescriptor && isAccessorDescriptor) {
      return Descriptor.Types.InvalidDescriptor;
    }
    if (isDataDescriptor) {
      return Descriptor.Types.DataDescriptor;
    }
    if (isAccessorDescriptor) {
      return Descriptor.Types.AccessorDescriptor;
    }
  };
  /**
   * @name createTypeError
   * @memberOf Internal.Descriptor
   * @function
   *
   * @param {object} invalidDescriptor
   * @returns {TypeError}
   */
  Descriptor.createTypeError = function createTypeError(invalidDescriptor){
    try{
      Object.defineProperty(Object.create(null),'prop', invalidDescriptor);
    }catch(e){
      return new TypeError(e.message);
    }
  };
  var globalDefaultDataDescriptor = (function () {
    var obj = Object.create(null);
    Object.defineProperty(obj,'key',{});
    return Object.getOwnPropertyDescriptor(obj,'key');
  })();
  var DataDescriptorKeys = 'configurable enumerable writable value init'.split(' ');
  var globalDefaultAccessorDescriptor = (function () {
    var obj = Object.create(null);
    Object.defineProperty(obj,'key',{
      get:function(){}
    });
    var descriptor = Object.getOwnPropertyDescriptor(obj, 'key');
    delete descriptor.get;
    return descriptor;
  })();
  var AccessorDescriptorKeys = 'configurable enumerable get set'.split(' ');
  /**
   * @name applyDefault
   * @memberOf Internal.Descriptor
   * @function
   *
   * @param {Internal.Descriptor.Types} type
   * @param {object} descriptor
   * @param {BeautifulProperties~GenericDescriptor=|BeautifulProperties~DataDescriptor=|BeautifulProperties~AccessorDescriptor=} defaultDescriptor
   * @returns {BeautifulProperties~DataDescriptor}
   */
  Descriptor.applyDefault = function applyDefault(type,descriptor,defaultDescriptor){
    var DescriptorKeys;
    var globalDefaultDescriptor;
    switch (type) {
      case Descriptor.Types.DataDescriptor:
        DescriptorKeys = DataDescriptorKeys;
        globalDefaultDescriptor = globalDefaultDataDescriptor;
        break;
      case Descriptor.Types.AccessorDescriptor:
        DescriptorKeys = AccessorDescriptorKeys;
        globalDefaultDescriptor = globalDefaultAccessorDescriptor;
        break;
      default :
        throw new Error('The type argument is invalid in Internal.Descriptor.applyDefault.');
    }
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
  };
  return Descriptor;
});