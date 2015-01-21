define('Hookable/Get',[
  './namespace','./Raw','./Hooks','./Descriptor',
  'utils/provideMethodsFactory','utils/createChildNamespace'
],function (Hookable,Raw,Hooks,Descriptor,
            provideMethodsFactory,createChildNamespace) {
  /**
   * @namespace Get
   * @memberOf BeautifulProperties.Hookable
   */
  var Get = createChildNamespace(Hookable,'Get');
  /**
   * @function refreshProperty
   * @memberOf BeautifulProperties.Hookable.Get
   *
   * @param {object} object
   * @param {string} key
   *
   * @see BeautifulProperties.Hookable~refresh
   */
  Get.refreshProperty = function refreshProperty(object,key){
    var previousVal = Raw.retrieve(object,key);
    var descriptor = Descriptor.walkAndRetrieve(object,key);
    var retriever = descriptor.get;
    var val = retriever.call(object);
    Raw.store(object,key,val);
    var storedHooks = Hooks.walkAndRetrieve(object,key);
    storedHooks.refresh.forEach(function(refresh){
      refresh.call(object,val,previousVal);
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
  Get.getSilently = function getSilently(object,key){
    var descriptor = Descriptor.walkAndRetrieve(object,key);
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
  Get.provideMethods = provideMethodsFactory(Get,['refreshProperty','getSilently']);
  return Get;
});