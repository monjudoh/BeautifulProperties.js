define('Hookable/Get',[
  './namespace','./Descriptor','./Status','./internal',
  'utils/provideMethodsFactory','utils/createChildNamespace'
],function (Hookable,Descriptor,Status,internal,
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
   * @param {object} target
   * @param {string} key
   *
   * @see BeautifulProperties.Hookable~refresh
   */
  Get.refreshProperty = function refreshProperty(target,key){
    var status = Status.retrieve(target,key);
    if (!status.isInitialized) {
      (internal.init_AccessorDescriptor)(target, key);
    }
    (internal.get_refreshProperty)(target,key);
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