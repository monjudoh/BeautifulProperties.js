define('Hookable/Status',[
  'InternalObject/PropertySpecific'
],function (PropertySpecific) {
  /**
   * @constructor BeautifulProperties.Hookable~Status
   * @property {boolean} isInitialized
   * @private
   */
  function Status(){
    this.isInitialized = false;
  }
  PropertySpecific.mixinRetriever('Hookable::Status',Status);
  /**
   * @function retrieve
   * @memberOf BeautifulProperties.Hookable~Status
   * @param {object} object
   * @param {string} key
   * @returns BeautifulProperties.Hookable~Status
   */
  Status.retrieve = PropertySpecific.retrieverFactory('Hookable::Status',true);
  return Status;
});