define('InternalObject/PropertySpecific',[
  'InternalObject',
  'LazyInitializable'
],function (InternalObject,
            LazyInitializable) {
  /**
   * @namespace BeautifulProperties~InternalObject/PropertySpecific
   */
  var PropertySpecific = Object.create(null);
  PropertySpecific.mixinNamespace = function mixinNamespace(namespase,constructor) {
    LazyInitializable.define(InternalObject.prototype,namespase,{
      init: function() {
        var container = Object.create(null);
        container.dict = Object.create(null);
        container._constructor = constructor;
        container.canCreate = typeof constructor === 'function';
        return container;
      },writable:false
    });
  };
  PropertySpecific.retrieverFactory = function retrieverFactory(namespase,create) {
    if (create === undefined) {
      create = true;
    }
    return function retrieve(object,key) {
      var container = InternalObject.retrieve(namespase,create,object);
      if (container === undefined) {
        return undefined;
      }
      if (container.canCreate && create && !container.dict[key]) {
        container.dict[key] = new (container._constructor);
      }
      return container.dict[key];
    };
  };
  PropertySpecific.storerFactory = function storerFactory(namespase) {
    return function store(object,key,value) {
      var container = InternalObject.retrieve(namespase,true,object);
      container.dict[key] = value;
    };
  };
  return PropertySpecific;
});