define('InternalObject',[
  'utils/hasOwn'
],function (hasOwn) {
  function InternalObject() {
    Object.defineProperty(this,'callbacks',{
      value : {},
      writable : false
    });
  }
  InternalObject.Key = 'BeautifulProperties::internalObjectKey';
  var internalObjectKey = InternalObject.Key;
  InternalObject.register = function register(object,namespace,value){
    var hasInternal = hasOwn(object,internalObjectKey);
    if (!hasInternal) {
      Object.defineProperty(object,internalObjectKey,{
        writable : true,
        configurable : true,
        enumerable : false,
        value : new InternalObject()
      });
    }
    object[internalObjectKey][namespace] = value;
  };
  return InternalObject;
});