define('Hookable/internal',[
  './Raw','./Status','./Hooks', './Descriptor', './Undefined'
],function (Raw,Status,Hooks, Descriptor, Undefined) {
  var internal = Object.create(null);
  internal.init_AccessorDescriptor = function init_AccessorDescriptor(target,key,object){
    var descriptor = Descriptor.retrieve(object,key);
    var status = Status.retrieve(target,key);
    var initialValue = descriptor.get.call(target);
    initialValue = (internal.beforeInit)(target,key,initialValue,object);
    Raw.store(target,key,initialValue);
    status.isInitialized = true;
    (internal.afterInit)(target, key, initialValue, object);
  };
  internal.beforeInit = function beforeInit(target, key, val, object){
    var storedHooks = Hooks.retrieve(object,key);
    storedHooks.beforeInit.forEach(function(beforeInit){
      var replacement = beforeInit.call(target,val);
      if (replacement === undefined && replacement !== Undefined) {
      } else if (replacement === Undefined) {
        val = undefined;
      } else {
        val = replacement;
      }
    });
    return val;
  };
  internal.afterInit = function afterInit(target, key, val, object){
    var storedHooks = Hooks.retrieve(object,key);
    storedHooks.afterInit.forEach(function(afterInit){
      afterInit.call(target,val);
    });
  };
  internal.get_refreshProperty = function get_refreshProperty(target,key){
    var previousVal = Raw.retrieve(target,key);
    var descriptor = Descriptor.walkAndRetrieve(target,key);
    var retriever = descriptor.get;
    var val = retriever.call(target);
    Raw.store(target,key,val);
    var storedHooks = Hooks.walkAndRetrieve(target,key);
    storedHooks.refresh.forEach(function(refresh){
      refresh.call(target,val,previousVal);
    });
  };
  return internal;
});