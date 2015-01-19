define('InternalObject/retrieve',[
  'InternalObject',
  'utils/hasOwn'
],function (InternalObject,
            hasOwn) {
  function retrieveInternalObject(key, create, object) {
    var internalObjectKey = InternalObject.Key;
    var hasInternal = hasOwn(object,internalObjectKey);
    if (!create) {
      return (hasInternal ? object[internalObjectKey] : {})[key];
    }
    if (!hasInternal) {
      Object.defineProperty(object,internalObjectKey,{
        writable : true,
        configurable : true,
        enumerable : false,
        value : new InternalObject()
      });
    }
    return object[internalObjectKey][key];
  }
  return retrieveInternalObject;
});