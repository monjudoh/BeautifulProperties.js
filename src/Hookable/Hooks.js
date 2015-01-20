define('Hookable/Hooks',[
  'LazyInitializable',
  './HookCollection'
],function (LazyInitializable,
            HookCollection) {
  /**
   * @constructor Hookable~Hooks
   * @property {Hookable~HookCollection} beforeGet
   * @property {Hookable~HookCollection} afterGet
   * @property {Hookable~HookCollection} beforeSet
   * @property {Hookable~HookCollection} afterSet
   * @property {Hookable~HookCollection} refresh
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