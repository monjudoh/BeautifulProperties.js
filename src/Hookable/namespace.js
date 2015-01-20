define('Hookable/namespace',[
  'namespace',
  'utils/createChildNamespace'
],function (BeautifulProperties,
            createChildNamespace) {
  /**
   * @namespace Hookable
   * @memberOf BeautifulProperties
   */
  return createChildNamespace(BeautifulProperties,'Hookable');
});