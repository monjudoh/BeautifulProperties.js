define('deprecated/Internal',[
  'namespace',
  'utils/createChildNamespace',
  'InternalObject'
],function (BeautifulProperties,
            createChildNamespace,
            InternalObject) {
  /**
   * @namespace Internal
   * @memberOf BeautifulProperties
   * @deprecated since version 0.1.9
   */
  var Internal = createChildNamespace(BeautifulProperties,'Internal');
  BeautifulProperties.Internal.Key = InternalObject.Key;
  BeautifulProperties.Internal.retrieve = InternalObject.retrieve;
  return Internal;
});