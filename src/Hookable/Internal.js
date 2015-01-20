define('Hookable/Internal',[
  'InternalObject/retrieve'
],function (retrieveInternalObject) {
  var HookableInternal = Object.create(null);
  HookableInternal.getRaw = (function () {
    var retrieveRaw = retrieveInternalObject.bind(null,'raw',false);
    var empty = Object.create(null);
    return function getRaw(object,key){
      return (retrieveRaw(object) || empty)[key];
    }
  })();
  HookableInternal.setRaw = (function () {
    var retrieveRaw = retrieveInternalObject.bind(null,'raw',true);
    return function setRaw(object,key,val) {
      var raw = retrieveRaw(object);
      raw[key] = val;
    }
  })();
  return HookableInternal;
});