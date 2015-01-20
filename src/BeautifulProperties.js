define('BeautifulProperties',[
  'namespace',
  'LazyInitializable',
  'Hookable',
  'Events',
  'Equals',
  'Observable',
  'Versionizable',
  'Internal',
  'deprecated'
],function(BeautifulProperties,
           LazyInitializable,
           Hookable,
           Events,
           Equals,
           Observable) {
  /**
   * @constant
   * @name VERSION
   * @memberOf BeautifulProperties
   */
  Object.defineProperty(BeautifulProperties,'VERSION',{
    value : '0.1.9',
    writable : false
  });
  return BeautifulProperties;
});