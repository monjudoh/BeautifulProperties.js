define('Observable/namespace',[
  'namespace',
  'utils/createChildNamespace'
],function (BeautifulProperties,
            createChildNamespace) {
  /**
   * @namespace Observable
   * @memberOf BeautifulProperties
   */
  return createChildNamespace(BeautifulProperties,'Observable');
});