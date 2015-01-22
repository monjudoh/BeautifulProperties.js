define('deprecated/since0.1.9',[
  'Hookable',
  './Internal'
],function (Hookable) {
  /**
   * @function addHooks
   * @memberOf BeautifulProperties.Hookable
   *
   * @param {object} object
   * @param {string} key
   * @param {{beforeGet:function=,afterGet:function=,beforeSet:function=,afterSet:function=,refresh:function=}} hooks
   * @see BeautifulProperties.Hookable.addHook
   * @deprecated since version 0.1.9
   */
  Hookable.addHooks = function addHooks(object,key,hooks) {
    if (!Hookable.hasHooks(object,key)) {
      throw new TypeError('The property (key:'+key+') is not a Hookable property. Hookable.addHooks is the method for a Hookable property.');
    }
    'beforeGet afterGet beforeSet afterSet refresh'.split(' ').forEach(function(hookType){
      if (hooks[hookType]) {
        Hookable.addHook(object,key,hookType,hooks[hookType]);
      }
    });
  };
});