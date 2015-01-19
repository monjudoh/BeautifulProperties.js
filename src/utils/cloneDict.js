define('utils/cloneDict',function () {
  /**
   *
   * @param {object} source
   * @returns {object}
   * @inner
   */
  function cloneDict(source){
    var target = Object.create(null);
    for (var key in source) {
      target[key] = source[key];
    }
    return target;
  }
  return cloneDict;
});