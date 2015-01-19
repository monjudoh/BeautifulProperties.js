define('Events/namespace',[
  'namespace'
],function (BeautifulProperties) {
  var namespace = Object.create(null);
  /**
   * @name BeautifulProperties.Events
   * @namespace
   */
  Object.defineProperty(BeautifulProperties,'Events',{
    value : namespace,
    writable : false
  });
  return namespace;
});