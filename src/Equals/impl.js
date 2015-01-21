define('Equals/impl',[
  './namespace','./Functions',
  'InternalObject/NamespacedKVS','InternalObject/PrototypeWalker'
],function (Equals,Functions,
            NamespacedKVS,PrototypeWalker) {
  NamespacedKVS.mixinNamespace('Equals');
  var store = NamespacedKVS.storeFnFactory('Equals');
  /**
   * @name set
   * @memberOf BeautifulProperties.Equals
   * @function
   * @see BeautifulProperties.Equals.equals
   *
   * @param {object} object
   * @param {string} key
   * @param {function(*,*):boolean} equalsFn equals function for BeautifulProperties.Equals.equals.
   * @description It set the equals function on the property.
   */
  Equals.set = function set(object,key,equalsFn){
    equalsFn = equalsFn || Functions.StrictEqual;
    store(object,key,equalsFn);
  };
  var walkAndRetrieve = PrototypeWalker.retrieve.bind(null,'Equals');
  /**
   * @name equals
   * @memberOf BeautifulProperties.Equals
   * @function
   *
   * @param {object} object
   * @param {string} key
   * @param {*} value
   * @param {*} otherValue
   * @returns {boolean}
   * @description If it returns true,value is equal to otherValue in the property.
   */
  Equals.equals = function equals(object,key,value,otherValue){
    var equalsFn = walkAndRetrieve(object,key);
    if (!equalsFn) {
      return value === otherValue;
    }
    if (equalsFn === Functions.StrictEqual){
      return value === otherValue;
    }
    return equalsFn.call(object,value,otherValue);
  };
});