define('Hookable/Raw',[
  'InternalObject/NamespacedKVS'
],function (NamespacedKVS) {
  NamespacedKVS.mixinNamespace('Hookable::Raw');
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
  Raw.retrieve = NamespacedKVS.retrieveFnFactory('Hookable::Raw', false);
  /**
   * @function store
   * @memberOf BeautifulProperties.Hookable~Raw
   * @param {object} object
   * @param {string} key
   * @param {*}
   */
  Raw.store = NamespacedKVS.storeFnFactory('Hookable::Raw');
  return Raw;
});