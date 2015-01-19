define('Hookable/Get',[
  './namespace','./Internal',
  'InternalObject/PrototypeWalker',
  'utils/provideMethodsFactory'
],function (Hookable,Internal,
            PrototypeWalker,
            provideMethodsFactory) {
  var Get = Object.create(null);
  /**
   * @name Get
   * @namespace
   * @memberOf BeautifulProperties.Hookable
   */
  Hookable.Get = Get;
  // internal functions
  var retrieveHooks = PrototypeWalker.retrieve.bind(null,'Hookable::Hooks');
  var retrieveDescriptor = PrototypeWalker.retrieve.bind(null,'Hookable::Descriptor');
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
    var previousVal = Internal.getRaw(object,key);
    var descriptor = retrieveDescriptor(object,key);
    var retriever = descriptor.get;
    var val = retriever.call(object);
    Internal.setRaw(object,key,val);
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
  return Get;
});