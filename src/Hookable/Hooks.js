define('Hookable/Hooks',[
  'LazyInitializable',
  'InternalObject/PropertySpecific','InternalObject/PrototypeWalker',
  './HookCollection'
],function (LazyInitializable,
            PropertySpecific,PrototypeWalker,
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

  PropertySpecific.mixinRetriever('Hookable::Hooks',Hooks);
  /**
   * @function retrieve
   * @memberOf BeautifulProperties.Hookable~Hooks
   * @param {object} object
   * @param {string} key
   * @returns BeautifulProperties.Hookable~Hooks
   */
  Hooks.retrieve = PropertySpecific.retrieverFactory('Hookable::Hooks',true);
  /**
   * @function walkAndRetrieve
   * @memberOf BeautifulProperties.Hookable~Hooks
   * @param {object} object
   * @param {string} key
   * @returns BeautifulProperties.Hookable~Hooks
   */
  Hooks.walkAndRetrieve = PrototypeWalker.retrieve.bind(null,'Hookable::Hooks');
  /**
   * @function has
   * @memberOf BeautifulProperties.Hookable~Hooks
   * @param {object} object
   * @param {string} key
   * @returns boolean
   */
  Hooks.has = (function (retrieve) {
    function hasHooks(object,key) {
      return !!retrieve(object,key);
    }
    return hasHooks;
  })(PropertySpecific.retrieverFactory('Hookable::Hooks',false));
  return Hooks;
});