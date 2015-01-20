define('Versionizable/retrieveHistory',[
  'InternalObject/retrieve'
],function (retrieveInternalObject) {
  /**
   * @function
   * @inner
   * @param {object} object
   * @returns {function(string):Array.<BeautifulProperties.Versionizable.Version>}
   */
  var retrieveHistory = retrieveInternalObject.bind(null,'Versionizable::History',true);
  return retrieveHistory;
});