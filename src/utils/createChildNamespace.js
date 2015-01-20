define('utils/createChildNamespace',function(){
  function createChildNamespace(parent,name) {
    var namespace = Object.create(null);
    Object.defineProperty(parent,name,{
      value : namespace,
      writable : false,
      configurable : false
    });
    return namespace;
  }
  return createChildNamespace;
});