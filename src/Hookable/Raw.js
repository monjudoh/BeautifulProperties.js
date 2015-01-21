define('Hookable/Raw',[
  'InternalObject/PropertySpecific'
],function (PropertySpecific) {
  PropertySpecific.mixinRetriever('Hookable::Raw');
  /**
   * @namespace BeautifulProperties.Hookable~Raw
   * @private
   */
  var Raw = Object.create(null);
  /**
   * @function retrieve
   * @memberOf BeautifulProperties.Hookable~Raw
   * @param {object} object
   * @param {string} key
   * @returns {*}
   */
  Raw.retrieve = PropertySpecific.retrieverFactory('Hookable::Raw',false);
  /**
   * @function store
   * @memberOf BeautifulProperties.Hookable~Raw
   * @param {object} object
   * @param {string} key
   * @param {*}
   */
  Raw.store = PropertySpecific.storerFactory('Hookable::Raw');
  return Raw;
});