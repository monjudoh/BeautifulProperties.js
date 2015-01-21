define('deprecated/Internal',[
  'namespace',
  'utils/createChildNamespace',
  'InternalObject','InternalObject/retrieve'
],function (BeautifulProperties,
            createChildNamespace,
            InternalObject,retrieveInternalObject) {
  /**
   * @namespace Internal
   * @memberOf BeautifulProperties
   * @deprecated since version 0.1.9
   */
  var Internal = createChildNamespace(BeautifulProperties,'Internal');
  BeautifulProperties.Internal.Key = InternalObject.Key;
  BeautifulProperties.Internal.retrieve = retrieveInternalObject;
  return Internal;
});