define('Equals/Functions', [
  './namespace',
  'utils/createChildNamespace'
],function (Equals,
            createChildNamespace) {
  /**
   * @name Functions
   * @namespace
   * @memberOf BeautifulProperties.Equals
   * @see BeautifulProperties.Equals.equals
   */
  var Functions = createChildNamespace(Equals,'Functions');
  /**
   * @function StrictEqual
   * @memberOf BeautifulProperties.Equals.Functions
   *
   * @param {*} value
   * @param {*} otherValue
   * @returns {boolean}
   * @description ===
   */
  Functions.StrictEqual = function StrictEqual(value,otherValue){
    return value === otherValue;
  };
  return Functions;
});