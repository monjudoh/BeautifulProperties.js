define('utils/hasOwn',function () {
  /**
   * @function
   * @param obj
   * @param key
   * @return {Boolean}
   */
  var hasOwn = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);
  return hasOwn;
});