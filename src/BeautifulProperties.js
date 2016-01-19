define('BeautifulProperties',[
  'namespace',
  'LazyInitializable',
  'Hookable',
  'Events',
  'Equals',
  'Observable',
  'Versionizable',
  'deprecated'
],function(BeautifulProperties) {
  /**
   * @constant
   * @name VERSION
   * @memberOf BeautifulProperties
   */
  Object.defineProperty(BeautifulProperties,'VERSION',{
    value : '0.1.12',
    writable : false
  });
  return BeautifulProperties;
});