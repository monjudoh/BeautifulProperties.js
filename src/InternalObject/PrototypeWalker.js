define('InternalObject/PrototypeWalker',[
  './PropertySpecific'
],function (PropertySpecific) {
  var PrototypeWalker = Object.create(null);
  PropertySpecific.mixinRetriever('PrototypeWalker::Cache',function() {
    return Object.create(null);
  });
  var retrieveCache = PropertySpecific.retrieverFactory('PrototypeWalker::Cache',true);
  PrototypeWalker.retrieve = function retrieve(internalObjectKey,object,key){
    var prototypeCache = retrieveCache(object,key);
    var retrieveValue = PropertySpecific.retrieverFactory(internalObjectKey,false);
    if (prototypeCache[internalObjectKey]) {
      return retrieveValue(prototypeCache[internalObjectKey],key);
    }
    // Walk the prototype chain until it found internal object.
    var proto = object;
    var value;
    while (!value && proto) {
      value = retrieveValue(proto,key);
      if (value) {
        prototypeCache[internalObjectKey] = proto;
        return value;
      }
      proto = Object.getPrototypeOf(proto);
    }
  };
  return PrototypeWalker;
});