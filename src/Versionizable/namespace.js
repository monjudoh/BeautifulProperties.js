define('Versionizable/namespace',[
  'namespace',
  'utils/createChildNamespace'
],function (BeautifulProperties,
            createChildNamespace) {
  /**
   * @namespace Versionizable
   * @memberOf BeautifulProperties
   */
  return createChildNamespace(BeautifulProperties,'Versionizable');
});