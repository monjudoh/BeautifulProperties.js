define('Events/HandlerCollection',[
  'InternalObject/NamespacedKVS'
],function (NamespacedKVS) {
  var namespace = 'Events:HandlerCollection';
  var proto = Object.create(null);
  proto.add = function add(handler,context) {
    this.push(handler);
    this.contexts.push(context);
  };
  proto.remove = function remove(handler) {
    var index;
    while ((index = this.indexOf(handler)) !== -1) {
      this.splice(index, 1);
      this.contexts.splice(index, 1);
    }
  };
  proto.clear = function clear() {
    this.length = 0;
    this.contexts.length = 0;
  };
  proto.clone = function clone() {
    var clone = new HandlerCollection;
    var length = this.length;
    for (var i = 0; i < length; i++) {
      clone[i] = this[i];
      clone.contexts[i] = this.contexts[i];
    }
    return clone;
  };
  function HandlerCollection(){
    var self = [];
    Object.keys(proto).forEach(function(key){
      self[key] = proto[key];
    });
    self.contexts = [];
    return self;
  }

  NamespacedKVS.mixinNamespace(namespace,HandlerCollection);
  HandlerCollection.retrieve = NamespacedKVS.retrieveFnFactory(namespace,false);
  HandlerCollection.retrieveWithCreate = NamespacedKVS.retrieveFnFactory(namespace,true);
  HandlerCollection.remove = NamespacedKVS.removeFnFactory(namespace);
  HandlerCollection.keys = NamespacedKVS.keysFnFactory(namespace);
  return HandlerCollection;
});