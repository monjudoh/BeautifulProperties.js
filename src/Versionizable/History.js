define('Versionizable/History',[
  'InternalObject/NamespacedKVS'
],function (NamespacedKVS) {
  var proto = Object.create(null);
  /**
   *
   * @constructor BeautifulProperties.Versionizable~History
   * @extends Array.<BeautifulProperties.Versionizable.Version>
   * @private
   */
  function History(){
    var self = [];
    Object.keys(proto).forEach(function(key){
      self[key] = proto[key];
    });
    return self;
  }
  NamespacedKVS.mixinNamespace('Versionizable::History',History);
  /**
   * @function retrieve
   * @memberOf BeautifulProperties.Versionizable~History
   * @param {object} object
   * @param {string} key
   * @returns BeautifulProperties.Versionizable~History
   */
  History.retrieve = NamespacedKVS.retrieverFactory('Versionizable::History',true);
  return History;
});