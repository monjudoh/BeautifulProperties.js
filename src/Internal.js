define('Internal',[
  'namespace',
  'utils/createChildNamespace',
  'InternalObject','InternalObject/retrieve'
],function (BeautifulProperties,
            createChildNamespace,
            InternalObject,retrieveInternalObject) {
  /**
   * @namespace Internal
   * @memberOf BeautifulProperties
   */
  var Internal = createChildNamespace(BeautifulProperties,'Internal');
  BeautifulProperties.Internal.Key = InternalObject.Key;
  BeautifulProperties.Internal.retrieve = retrieveInternalObject;
  return Internal;
});