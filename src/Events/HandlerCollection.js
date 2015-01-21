define('Events/HandlerCollection',[
  'InternalObject/NamespacedKVS'
],function (NamespacedKVS) {
  var namespace = 'Events:HandlerCollection';
  var proto = Object.create(null);
  proto.remove = function remove(handler) {
    var list = this;
    var i;
    for (i = list.length - 1; i >= 0; i--) {
      if (handler && list[i].originalCallback === handler) {
        list.splice(i, 1);
      }
    }
  };
  proto.clear = function clear() {
    this.length = 0;
  };
  function HandlerCollection(){
    var self = [];
    Object.keys(proto).forEach(function(key){
      self[key] = proto[key];
    });
    return self;
  }

  NamespacedKVS.mixinNamespace(namespace,HandlerCollection);
  HandlerCollection.retrieve = NamespacedKVS.retrieveFnFactory(namespace,false);
  HandlerCollection.retrieveWithCreate = NamespacedKVS.retrieveFnFactory(namespace,true);
  HandlerCollection.remove = NamespacedKVS.removeFnFactory(namespace);
  HandlerCollection.keys = NamespacedKVS.keysFnFactory(namespace);
  return HandlerCollection;
});