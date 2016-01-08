define('Events/HandlerCollection',[
  'InternalObject/NamespacedKVS'
],function (NamespacedKVS) {
  var namespace = 'Events:HandlerCollection';
  var proto = Object.create(null);
  /**
   * @function add
   * @memberOf BeautifulProperties.Events~HandlerCollection#
   * @param {function} handler
   * @param {BeautifulProperties.Events~BindingOptions} options
   */
  proto.add = function add(handler,options) {
    this.push(handler);
    this.optionsList.push(options);
  };
  /**
   * @function remove
   * @memberOf BeautifulProperties.Events~HandlerCollection#
   * @param {function} handler
   * @param {BeautifulProperties.Events~BindingOptions=} options
   */
  proto.remove = function remove(handler, options) {
    var thisObject;
    var existsThisObject = false;
    if (options) {
      if (options.thisObject != null) {
        thisObject = options.thisObject;
        existsThisObject = true;
      }
    }
    var index;
    var previousIndex = 0;
    while ((index = this.indexOf(handler,previousIndex)) !== -1) {
      if (existsThisObject && this.optionsList[index].thisObject !== thisObject) {
        previousIndex = index + 1;
        continue;
      }
      this.splice(index, 1);
      this.optionsList.splice(index, 1);
      previousIndex = index;
    }
  };

  /**
   * @function clear
   * @memberOf BeautifulProperties.Events~HandlerCollection#
   */
  proto.clear = function clear() {
    this.length = 0;
    this.optionsList.length = 0;
  };
  /**
   * @function clone
   * @memberOf BeautifulProperties.Events~HandlerCollection#
   */
  proto.clone = function clone() {
    var clone = new HandlerCollection;
    var length = this.length;
    for (var i = 0; i < length; i++) {
      clone[i] = this[i];
      clone.optionsList[i] = this.optionsList[i];
    }
    return clone;
  };
  /**
   * @constructor BeautifulProperties.Events~HandlerCollection
   * @extends Array.<function>
   * @private
   */
  function HandlerCollection(){
    var self = [];
    Object.keys(proto).forEach(function(key){
      self[key] = proto[key];
    });
    self.optionsList = [];
    return self;
  }

  NamespacedKVS.mixinNamespace(namespace,HandlerCollection);
  HandlerCollection.retrieve = NamespacedKVS.retrieveFnFactory(namespace,false);
  HandlerCollection.retrieveWithCreate = NamespacedKVS.retrieveFnFactory(namespace,true);
  HandlerCollection.remove = NamespacedKVS.removeFnFactory(namespace);
  HandlerCollection.keys = NamespacedKVS.keysFnFactory(namespace);
  return HandlerCollection;
});