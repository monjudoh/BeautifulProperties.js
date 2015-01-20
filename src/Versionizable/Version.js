define('Versionizable/Version',[
  './namespace'
],function (Versionizable) {
  /**
   * @constructor Version
   * @memberOf BeautifulProperties.Versionizable
   *
   * @property {boolean} isNull
   * @property {*} value
   * @property {number} timestamp
   */
  function Version(){
  }
  Object.defineProperty(Version.prototype,'isNull',{
    value:false,
    writable:true
  });
  Versionizable.Version = Version;
  return Version;
});