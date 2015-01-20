define('Hookable/Hooks',[
  'LazyInitializable',
  './HookCollection'
],function (LazyInitializable,
            HookCollection) {
  /**
   * @constructor BeautifulProperties.Hookable~Hooks
   * @property {BeautifulProperties.Hookable~HookCollection} beforeGet
   * @property {BeautifulProperties.Hookable~HookCollection} afterGet
   * @property {BeautifulProperties.Hookable~HookCollection} beforeSet
   * @property {BeautifulProperties.Hookable~HookCollection} afterSet
   * @property {BeautifulProperties.Hookable~HookCollection} refresh
   * @private
   */
  function Hooks(){}
  var proto = Hooks.prototype;

  'beforeGet afterGet beforeSet afterSet refresh'.split(' ').forEach(function(key){
    LazyInitializable.define(proto,key,{
      init:function(){
        return new HookCollection;
      }
    });
  });
  return Hooks;
});