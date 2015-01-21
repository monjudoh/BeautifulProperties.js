define('InternalObject/NamespacedKVS',[
  'InternalObject',
  'LazyInitializable'
],function (InternalObject,
            LazyInitializable) {
  /**
   * @namespace BeautifulProperties~InternalObject/NamespacedKVS
   * @private
   */
  var NamespacedKVS = Object.create(null);
  NamespacedKVS.mixinNamespace = function mixinNamespace(namespase,constructor) {
    LazyInitializable.define(InternalObject.prototype,namespase,{
      init: function() {
        var container = Object.create(null);
        container.dict = Object.create(null);
        container._constructor = constructor;
        container.canCreate = typeof constructor === 'function';
        return container;
      },writable:false
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
    return function retrieve(object,key) {
      var container = InternalObject.retrieve(namespase,create,object);
      if (container === undefined) {
        return undefined;
      }
      if (container.canCreate && create && !container.dict[key]) {
        container.dict[key] = new (container._constructor);
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
    return function store(object,key,value) {
      var container = InternalObject.retrieve(namespase,true,object);
      container.dict[key] = value;
    };
  };
  return NamespacedKVS;
});