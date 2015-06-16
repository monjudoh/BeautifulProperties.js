define('LazyInitializable',[
  'namespace',
  'internal/Descriptor',
  'utils/hasOwn','utils/hasConsoleError','utils/createChildNamespace'
],function (BeautifulProperties,
            Descriptor,
            hasOwn,hasConsoleError,createChildNamespace) {
  /**
   * @namespace LazyInitializable
   * @memberOf BeautifulProperties
   */
  var LazyInitializable = createChildNamespace(BeautifulProperties,'LazyInitializable');
  /**
   * @function define
   * @memberOf BeautifulProperties.LazyInitializable
   *
   * @param {object} object
   * @param {string} key
   * @param {BeautifulProperties~DataDescriptor} descriptor
   */
  LazyInitializable.define = function defineLazyInitializableProperty(object,key,descriptor) {
    var init = descriptor.init;
    descriptor = Descriptor.applyDefault(Descriptor.Types.DataDescriptor,descriptor);
    Object.defineProperty(object,key,{
      get : function () {
        var self = this;
        var currentDescriptor = Object.getOwnPropertyDescriptor(self,key);
        // The getter is rarely called twice in Mobile Safari(iOS6.0).
        // Given init function is called twice when the getter is called twice.
        // If descriptor.writable or descriptor.configurable is false,
        // "Attempting to change value of a readonly property." error is thrown
        // when calling given init function for the second time.
        var isInitialized = !!currentDescriptor && hasOwn(currentDescriptor,'value');
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
      set : function (val) {
        var self = this;
        descriptor.value = val;
        Object.defineProperty(self,key,descriptor);
      },
      configurable : true
    });
  };
  return LazyInitializable;
});