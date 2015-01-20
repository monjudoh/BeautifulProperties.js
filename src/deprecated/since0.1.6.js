define('deprecated/since0.1.6',[
  'namespace',
  'Hookable/Internal'
],function(BeautifulProperties,
           HookableInternal){
  /**
   * @name getRaw
   * @memberOf BeautifulProperties
   * @function
   * @deprecated since version 0.1.6
   * @see BeautifulProperties.Hookable.getRaw
   *
   * @param {Object} object
   * @param {String} key
   * @return {*}
   */
  BeautifulProperties.getRaw = function getRaw(object,key) {
    return HookableInternal.getRaw(object,key);
  };
  /**
   * @name setRaw
   * @memberOf BeautifulProperties
   * @function
   * @deprecated since version 0.1.6
   * @see BeautifulProperties.Hookable.setRaw
   *
   * @param {Object} object
   * @param {String} key
   * @param {*} val
   */
  BeautifulProperties.setRaw = function setRaw(object,key,val) {
    HookableInternal.setRaw(object,key,val);
  };
});