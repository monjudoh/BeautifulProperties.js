define('Hookable/Internal',[
  './Meta','./Hooks',
  'InternalObject/PropertySpecific','InternalObject/retrieve'
],function (Meta,Hooks,
            PropertySpecific,retrieveInternalObject) {
  var HookableInternal = Object.create(null);
  PropertySpecific.mixinRetriever('Hookable::Meta',Meta);
  PropertySpecific.mixinRetriever('Hookable::Hooks',Hooks);
  PropertySpecific.mixinRetriever('Hookable::Descriptor');
  HookableInternal.retrieveMeta = PropertySpecific.retrieverFactory('Hookable::Meta',true);
  HookableInternal.retrieveHooks = PropertySpecific.retrieverFactory('Hookable::Hooks',true);
  HookableInternal.retrieveDescriptor = PropertySpecific.retrieverFactory('Hookable::Descriptor',false);
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