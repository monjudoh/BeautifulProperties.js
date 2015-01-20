define('InternalObject/PropertySpecific',[
  'InternalObject','./retrieve',
  'LazyInitializable'
],function (InternalObject,retrieveInternalObject,
            LazyInitializable) {
  var PropertySpecific = Object.create(null);
  /**
   *
   * @param key
   * @param constructor
   * @private
   */
  PropertySpecific.mixinRetriever = function mixinRetriever(key,constructor) {
    LazyInitializable.define(InternalObject.prototype,key,{
      init: function() {
        var object = Object.create(null);
        var canCreate = typeof constructor === 'function';
        var boundRetrieve = (function retrieve(key,create){
          if (create === undefined) {
            create = true;
          }
          if (canCreate && create && !this[key]) {
            this[key] = new constructor;
          }
          return this[key];
        }).bind(object);
        boundRetrieve.store = (function store(key,value) {
          this[key] = value;
        }).bind(object);
        return boundRetrieve;
      },writable:false
    });
  };
  /**
   *
   * @param key
   * @param create
   * @return {function}
   * @private
   */
  PropertySpecific.retrieverFactory = function retrieverFactory(key,create) {
    var getRetrieverFromObject = retrieveInternalObject.bind(null,key,create);
    return function (object,key) {
      var retrieve = getRetrieverFromObject(object);
      return retrieve !== undefined
      ? retrieve(key,create)
      : undefined;
    }
  };
  PropertySpecific.storerFactory = function storerFactory(key) {
    var getRetrieverFromObject = retrieveInternalObject.bind(null,key,true);
    return function store(object,key,value) {
      var retriever = getRetrieverFromObject(object);
      var store = retriever.store;
      store(key,value);
    }
  };
  return PropertySpecific;
});