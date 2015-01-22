define('InternalObject/PrototypeWalker',[
  './NamespacedKVS'
],function (NamespacedKVS) {
  var PrototypeWalker = Object.create(null);
  NamespacedKVS.mixinNamespace('PrototypeWalker::Cache',function() {
    return Object.create(null);
  });
  var retrieveCache = NamespacedKVS.retrieveFnFactory('PrototypeWalker::Cache', true);
  PrototypeWalker.retrieve = function retrieve(namespace,object,key){
    var prototypeCache = retrieveCache(object,key);
    var retrieveValue = NamespacedKVS.retrieveFnFactory(namespace, false);
    if (prototypeCache[namespace]) {
      return retrieveValue(prototypeCache[namespace],key);
    }
    // Walk the prototype chain until it found internal object.
    var proto = object;
    var value;
    while (!value && proto) {
      value = retrieveValue(proto,key);
      if (value) {
        prototypeCache[namespace] = proto;
        return value;
      }
      proto = Object.getPrototypeOf(proto);
    }
  };
  return PrototypeWalker;
});