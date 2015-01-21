define('Hookable/alias',[
  './namespace',
  './Raw','./Hooks'
],function (Hookable,
            Raw,Hooks) {
  /**
   * @function getRaw
   * @memberOf BeautifulProperties.Hookable
   *
   * @param {object} object
   * @param {string} key
   * @returns {*}
   * @description Get the property value away from hook executing.
   * @see BeautifulProperties.Hookable~Raw.retrieve
   */
  Hookable.getRaw = Raw.retrieve;

  /**
   * @function setRaw
   * @memberOf BeautifulProperties.Hookable
   *
   * @param {object} object
   * @param {string} key
   * @param {*} val
   * @description Set the property value away from hook executing.
   * @see BeautifulProperties.Hookable~Raw.store
   */
  Hookable.setRaw = Raw.store;
  /**
   * @function hasHooks
   * @memberOf BeautifulProperties.Hookable
   *
   * @param {object} object
   * @param {string} key
   * @returns {boolean}
   * @description Return true if the property has hooks.
   * @see BeautifulProperties.Hookable~Hooks.has
   */
  Hookable.hasHooks = Hooks.has;
});