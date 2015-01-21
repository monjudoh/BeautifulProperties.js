define('Hookable/Descriptor',[
  'internal/Descriptor',
  'InternalObject/NamespacedKVS','InternalObject/PrototypeWalker'
],function (base,
            NamespacedKVS,PrototypeWalker) {
  /**
   * @namespace BeautifulProperties.Hookable~Descriptor
   * @extends BeautifulProperties~Descriptor
   * @private
   */
  var Descriptor = Object.create(base);
  NamespacedKVS.mixinNamespace('Hookable::Descriptor');
  /**
   * @function retrieve
   * @memberOf BeautifulProperties.Hookable~Descriptor
   * @param {object} object
   * @param {string} key
   * @returns {(BeautifulProperties~DataDescriptor|BeautifulProperties~AccessorDescriptor|BeautifulProperties~GenericDescriptor)=}
   */
  Descriptor.retrieve = NamespacedKVS.retrieverFactory('Hookable::Descriptor',false);
  /**
   * @function walkAndRetrieve
   * @memberOf BeautifulProperties.Hookable~Descriptor
   * @param {object} object
   * @param {string} key
   * @returns {(BeautifulProperties~DataDescriptor|BeautifulProperties~AccessorDescriptor|BeautifulProperties~GenericDescriptor)=}
   */
  Descriptor.walkAndRetrieve = PrototypeWalker.retrieve.bind(null,'Hookable::Descriptor');
  /**
   * @function store
   * @memberOf BeautifulProperties.Hookable~Descriptor
   * @param {object} object
   * @param {string} key
   * @param {(BeautifulProperties~DataDescriptor|BeautifulProperties~AccessorDescriptor|BeautifulProperties~GenericDescriptor)}
   */
  Descriptor.store = NamespacedKVS.storerFactory('Hookable::Descriptor');
  return Descriptor;
});