define('utils/provideMethodsFactory',[
  './Array_from'
],function (Array_from) {
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
        Object.defineProperty(object,methodName,{
          value:function () {
            var args = Array_from(arguments);
            args.unshift(this);
            return methodImpl.apply(namespaceObject,args);
          },
          enumerable:false,
          configurable:true
        });
      });
    }
    return provideMethods;
  }
  return provideMethodsFactory;
});