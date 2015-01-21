define('Hookable/Status',[
  'InternalObject/NamespacedKVS'
],function (NamespacedKVS) {
  /**
   * @constructor BeautifulProperties.Hookable~Status
   * @property {boolean} isInitialized
   * @private
   */
  function Status(){
    this.isInitialized = false;
  }
  NamespacedKVS.mixinNamespace('Hookable::Status',Status);
  /**
   * @function retrieve
   * @memberOf BeautifulProperties.Hookable~Status
   * @param {object} object
   * @param {string} key
   * @returns BeautifulProperties.Hookable~Status
   */
  Status.retrieve = NamespacedKVS.retrieveFnFactory('Hookable::Status', true);
  return Status;
});