define('Events/namespace',[
  'namespace',
  'utils/createChildNamespace'
],function (BeautifulProperties,
            createChildNamespace) {
  /**
   * @namespace Events
   * @memberOf BeautifulProperties
   */
  return createChildNamespace(BeautifulProperties,'Events');
});