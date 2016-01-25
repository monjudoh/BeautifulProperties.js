define('Hookable/internal',[
  './Raw','./Status','./Hooks', './Descriptor', './Undefined'
],function (Raw,Status,Hooks, Descriptor, Undefined) {
  var internal = Object.create(null);
  internal.init_AccessorDescriptor = function init_AccessorDescriptor(target,key,object){
    var descriptor = object !== undefined ? Descriptor.retrieve(object,key) : Descriptor.walkAndRetrieve(target,key);
    var status = Status.retrieve(target,key);
    var initialValue = descriptor.get.call(target);
    initialValue = (internal.beforeInit)(target,key,initialValue,object);
    Raw.store(target,key,initialValue);
    status.isInitialized = true;
    (internal.afterInit)(target, key, initialValue, object);
  };
  internal.init_DataDescriptor = function init_DataDescriptor(target,key,value,object){
    var descriptor = object !== undefined ? Descriptor.retrieve(object,key) : Descriptor.walkAndRetrieve(target,key);
    var initialValue;
    var isInitialiseByAssignedValue = false;
    if (descriptor.init) {
      initialValue = descriptor.init.call(target);
    } else if (descriptor.value !== undefined) {
      if (descriptor.value !== Undefined) {
        initialValue = descriptor.value;
      } else {
        initialValue = undefined;
      }
    } else if (value !== Undefined) {
      initialValue = value;
      isInitialiseByAssignedValue = true;
    } else {
      return;
    }
    initialValue = (internal.beforeInit)(target,key,initialValue,object);
    Raw.store(target,key,initialValue);
    Status.retrieve(target,key).isInitialized = true;
    (internal.afterInit)(target, key, initialValue, object);
    if (value !== Undefined && !isInitialiseByAssignedValue) {
      target[key] = value;
    }
  };
  internal.beforeInit = function beforeInit(target, key, val, object){
    var storedHooks = object !== undefined ? Hooks.retrieve(object,key) : Hooks.walkAndRetrieve(target,key);
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
    var storedHooks = object !== undefined ? Hooks.retrieve(object,key) : Hooks.walkAndRetrieve(target,key);
    storedHooks.afterInit.forEach(function(afterInit){
      afterInit.call(target,val);
    });
  };
  internal.get_refreshProperty = function get_refreshProperty(target, key, object){
    var previousVal = Raw.retrieve(target,key);
    var descriptor = object !== undefined ? Descriptor.retrieve(object,key) : Descriptor.walkAndRetrieve(target,key);
    var retriever = descriptor.get;
    var val = retriever.call(target);
    Raw.store(target,key,val);
    var storedHooks = object !== undefined ? Hooks.retrieve(object,key) : Hooks.walkAndRetrieve(target,key);
    storedHooks.refresh.forEach(function(refresh){
      refresh.call(target,val,previousVal);
    });
  };
  internal.get_beforeGet = function get_beforeGet(target,key,object){
    var storedHooks = Hooks.retrieve(object,key);
    storedHooks.beforeGet.forEach(function(beforeGet){
      beforeGet.call(target);
    });
  };
  internal.get_afterGet = function get_afterGet(target,key,val,object){
    var storedHooks = Hooks.retrieve(object,key);
    storedHooks.afterGet.forEach(function(afterGet){
      var replacedVal = afterGet.call(target,val);
      if (replacedVal === undefined && replacedVal !== Undefined) {
      } else if (replacedVal === Undefined) {
        val = undefined;
      } else {
        val = replacedVal;
      }
    });
    return val;
  };
  internal.set_beforeSet = function set_beforeSet(target,key,val,previousVal,object){
    var storedHooks = Hooks.retrieve(object,key);
    storedHooks.beforeSet.forEach(function(beforeSet){
      var replacedVal = beforeSet.call(target,val,previousVal);
      if (replacedVal === undefined && replacedVal !== Undefined) {
      } else if (replacedVal === Undefined) {
        val = undefined;
      } else {
        val = replacedVal;
      }
    });
    return val;
  };
  internal.set_afterSet = function set_afterSet(target,key,val,previousVal,object){
    var storedHooks = Hooks.retrieve(object,key);
    storedHooks.afterSet.forEach(function(afterSet){
      afterSet.call(target,val,previousVal);
    });
  };
  return internal;
});