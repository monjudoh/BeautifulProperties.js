define('InternalObject/constructor',[
  'utils/hasOwn'
],function (hasOwn) {
  /**
   * @constructor BeautifulProperties~InternalObject
   * @private
   */
  function InternalObject() {}
  InternalObject.Key = 'BeautifulProperties::InternalObject::Key';
  var Key = InternalObject.Key;
  InternalObject.register = function register(object,namespace,value){
    var hasInternal = hasOwn(object,Key);
    if (!hasInternal) {
      Object.defineProperty(object,Key,{
        writable : true,
        configurable : true,
        enumerable : false,
        value : new InternalObject()
      });
    }
    object[Key][namespace] = value;
  };
  InternalObject.retrieve = function retrieve(namespace, create, object) {
    var hasInternal = hasOwn(object,Key);
    if (!create) {
      return (hasInternal ? object[Key] : {})[namespace];
    }
    if (!hasInternal) {
      Object.defineProperty(object,Key,{
        writable : true,
        configurable : true,
        enumerable : false,
        value : new InternalObject()
      });
    }
    return object[Key][namespace];
  };
  return InternalObject;
});