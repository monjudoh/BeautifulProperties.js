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
   * @function getTypeOf
   * @memberOf BeautifulProperties~Descriptor
   *
   * @param {object} descriptor
   * @returns {BeautifulProperties~Descriptor.Type}
   */
  Descriptor.getTypeOf = function getTypeOf(descriptor){
    if (descriptor === undefined) {
      return Types.InvalidDescriptor;
    }
    var isDataDescriptor = descriptor.writable !== undefined || descriptor.value !== undefined || descriptor.init!== undefined;
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
   * @function applyDefault
   * @memberOf BeautifulProperties~Descriptor
   *
   * @param {BeautifulProperties~Descriptor.Type} type
   * @param {object} descriptor
   * @param {BeautifulProperties~GenericDescriptor=|BeautifulProperties~DataDescriptor=|BeautifulProperties~AccessorDescriptor=} defaultDescriptor
   * @returns {BeautifulProperties~DataDescriptor}
   */
  Descriptor.applyDefault = function applyDefault(type,descriptor,defaultDescriptor){
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